import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import Course from '../models/Course.js';
import Teacher from '../models/Teacher.js';
import User from '../models/User.js';
import { searchKnowledge } from '../rag/search.js';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function calculateCGPA(results) {
    if (!results || results.length === 0) return 0;
    let totalQualityPoints = 0;
    let totalCreditHours = 0;
    results.forEach(r => {
        totalQualityPoints += r.gpa * r.creditHours;
        totalCreditHours += r.creditHours;
    });
    return totalCreditHours > 0
        ? Number((totalQualityPoints / totalCreditHours).toFixed(2))
        : 0;
}

async function getStudentCGPA(studentName) {
    const student = await Student.findOne({ name: { $regex: studentName, $options: 'i' } });
    if (!student) return null;
    return { student, cgpa: calculateCGPA(student.results) };
}

async function getTopStudent(students) {
    if (!students || students.length === 0) return null;
    let topStudent = [];
    let highestCGPA = -1;

    students.forEach(student => {
        const cgpa = calculateCGPA(student.results);

        if (cgpa > highestCGPA) {
            highestCGPA = cgpa;
            topStudent = [student];
        }

        else if (cgpa === highestCGPA) {
            topStudent.push(student);
        }
    });

    return { student: topStudent, cgpa: highestCGPA, tie: (topStudent.length > 1), rule: 'Top students are determined solely by highest CGPA. If multiple students share the highest CGPA, they are all considered top students.' };
}

async function getStudentRecord(studentName) {
    const student = await Student.findOne({ name: { $regex: studentName, $options: 'i' } });
    if (!student) return null;

    const attendanceRecords = await Attendance.find({ 'records.studentID': student.id });
    let present = 0, absent = 0;
    attendanceRecords.forEach(att => {
        att.records.forEach(rec => {
            if (rec.studentID === student.id) {
                if (rec.status === 'Present') present++;
                else if (rec.status === 'Absent') absent++;
            }
        });
    });
    const total = present + absent;
    const attendancePercentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;
    const averageMarks = student.results.length > 0
        ? (student.results.reduce((sum, r) => sum + r.marks, 0) / student.results.length).toFixed(2)
        : 0;

    return { student, averageMarks, attendancePercentage };
}

async function getLowAttendanceStudents(threshold = 75) {
    const students = await Student.find();
    const attendanceRecords = await Attendance.find();
    const low = [];

    for (const student of students) {
        let present = 0, absent = 0;
        attendanceRecords.forEach(att => {
            att.records.forEach(rec => {
                if (rec.studentID === student.id) {
                    if (rec.status === 'Present') present++;
                    else if (rec.status === 'Absent') absent++;
                }
            });
        });
        const total = present + absent;
        const pct = total > 0 ? (present / total) * 100 : 0;
        if (pct < threshold) low.push({ id: student.id, name: student.name, attendance: pct.toFixed(2) });
    }
    return low;
}

function getGradeSystem() {
    return [
        { marksRange: '85–100', gpa: '4.0' },
        { marksRange: '80–84', gpa: '3.7' },
        { marksRange: '75–79', gpa: '3.3' },
        { marksRange: '70–74', gpa: '3.0' },
        { marksRange: '65–69', gpa: '2.7' },
        { marksRange: '60–64', gpa: '2.3' },
        { marksRange: '55–59', gpa: '2.0' },
        { marksRange: '50–54', gpa: '1.7' },
        { marksRange: '0–49', gpa: '0.0 (Fail)' },
    ];
}

function buildMongoFilters(filters = {}) {
    const mongo = {};
    for (const key in filters) {
        const f = filters[key];
        if (typeof f !== 'object' || f === null || !f.operator) {
            mongo[key] = f;
            continue;
        }
        switch (f.operator) {
            case '$gt': case '$gte': case '$lt': case '$lte': case '$ne':
                mongo[key] = { [f.operator]: f.value };
                break;
            case 'between':
                mongo[key] = { $gte: f.min, $lte: f.max };
                break;
            case 'contains':
                mongo[key] = { $regex: f.value, $options: 'i' };
                break;
            default:
                mongo[key] = f.value;
        }
    }
    return mongo;
}


// ─── TOOL HANDLERS ────────────────────────────────────────────────────────────
// Every tool receives (context, step, user) and mutates context.
// The executer's synthesize() step turns context into a final reply.

export async function databaseQueryTool(context, step, user) {
    const filters = buildMongoFilters(step.input?.filters);
    const col = step.input?.collection;

    if (col === 'courses') {
        context.courses = await Course.find(filters);
        return;
    }
    if (col === 'teachers') {
        context.teachers = await Teacher.find(filters);
        return;
    }
    if (col === 'students') {
        if (user.role === 'Admin' || user.role === 'Teacher') {
            context.students = await Student.find(filters);
        } else {
            // Students can only see their own record
            context.students = await Student.find({ id: user.userID });
        }
        return;
    }
    if (col === 'attendances') {
        if (user.role === 'Admin' || user.role === 'Teacher') {
            context.attendances = await Attendance.find(filters);
        } else {
            context.attendances = await Attendance.find({ 'records.studentID': user.userID });
        }
        return;
    }
    if (col === 'users') {
        if (user.role === 'Admin') {
            context.users = await User.find(filters);
        } else {
            context.users = await User.findOne({ userID: user.userID }).select('username role email');
        }
        return;
    }

    throw new Error(`Unknown collection: ${col}`);
}

export async function topStudentTool(context, _step, user) {
    if (user.role === 'Student') {
        context.error = 'Permission denied: students cannot view top-student rankings.';
        return;
    }

    // Use whatever DATABASE_QUERY already fetched; fall back to all students.
    const students = context.students?.length ? context.students : await Student.find();
    const topResult = await getTopStudent(students);

    context.topStudent = topResult;
}

export async function studentCountTool(context) {
    const students = context.students?.length ? context.students : await Student.find();
    context.totalStudents = students.length;
}

export async function lowAttendanceTool(context, _step, user) {
    if (user.role === 'Student') {
        context.error = 'Permission denied: you do not have access to attendance summaries.';
        return;
    }

    context.lowAttendanceStudents = await getLowAttendanceStudents();
}

export async function studentReportTool(context, step, user) {
    const targetName =
        step.input?.name ||
        context.topStudent?.student?.name ||
        context.students?.[0]?.name ||
        user.username;

    console.log('Target Name in Student Report Tool: ', targetName);

    if (user.role === 'Student' && targetName.toLowerCase() !== user.username.toLowerCase()) {
        context.error = 'Permission denied: you can only view your own report.';
        return;
    }

    const report = await getStudentRecord(targetName);
    if (!report) {
        context.directReply = `No student found with the name "${targetName}".`;
        return;
    }

    context.studentReport = {
        name: report.student.name,
        department: report.student.department,
        semester: report.student.semester,
        averageMarks: report.averageMarks,
        attendancePercentage: report.attendancePercentage,
    };
}

export async function studentCGPATool(context, step, user) {
    const targetName =
        step.input?.name ||
        context.topStudent?.student?.name ||
        context.students?.[0]?.name ||
        user.username;

    if (user.role === 'Student' && targetName.toLowerCase() !== user.username.toLowerCase()) {
        context.error = 'Permission denied: you can only view your own CGPA.';
        return;
    }

    const result = await getStudentCGPA(targetName);
    if (!result) {
        context.directReply = `No student found with the name "${targetName}".`;
        return;
    }

    context.studentCGPA = {
        name: result.student.name,
        department: result.student.department,
        semester: result.student.semester,
        cgpa: result.cgpa,
    };
}

export async function gradeCriteriaTool(context) {
    context.gradeSystem = getGradeSystem();
}

export async function generalChatTool(context) {
    context.generalChat = true;
}

export async function ragSearchTool(context, step) {
    const results = await searchKnowledge(step.input.text);

    context.knowledge = results;
}