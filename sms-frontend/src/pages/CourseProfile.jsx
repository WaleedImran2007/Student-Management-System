import { useLocation } from "react-router-dom";
import "../css/courseProfile.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CourseProfile = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const courseCode = query.get("code");

    const token = localStorage.getItem('token');

    let userRole = null;
    let userID = null;

    if (token) {
        const decoded = jwtDecode(token);
        userRole = decoded.role;
        userID = decoded.userID;
    }

    const studentAPI = `${import.meta.env.VITE_API_URL}/api/students`;
    const courseAPI = `${import.meta.env.VITE_API_URL}/api/courses`;

    const [studentArray, setStudentArray] = useState([]);
    const [course, setCourse] = useState({});

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courseRes = await axios.get(`${courseAPI}/${courseCode}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCourse(courseRes.data);

            } catch (err) {
                console.log(err);
            }
        }

        const fetchStudents = async () => {
            try {
                const studentRes = await axios.get(studentAPI, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setStudentArray(studentRes.data);
            }

            catch (err) {
                console.log(err);
            }
        }

        const fetchMyStudent = async () => {
            try {
                const studentRes = await axios.get(`${studentAPI}/${userID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setStudentArray([studentRes.data]);
            }

            catch (err) {
                console.log(err);
            }
        }

        fetchCourses();
        userRole === 'Student' ? fetchMyStudent() : fetchStudents();

    }, [courseCode, userID, token, userRole]);

    const enrolledStudents = studentArray.filter(student =>
        student.results?.some(result =>
            result.courseCode === courseCode
        )
    )

    let totalMarks = 0;
    let averageMarks = 0;

    enrolledStudents.forEach(student => {
        const result = student.results.find(result =>
            result.courseCode === courseCode
        )

        if (result) {
            return totalMarks += Number(result.marks);
        }

    });

    if (enrolledStudents.length > 0) {
        console.log(totalMarks);
        averageMarks = (totalMarks / enrolledStudents.length).toFixed(2);
    }


    return (
        <div className="course-profile-container">

            {/* HEADER */}
            <div className="course-header">
                <div className="course-icon">
                    <i className="fa-solid fa-book"></i>
                </div>

                <div>
                    <div className="course-name">
                        {course.name}
                    </div>

                    <div className="course-code">
                        COURSE CODE: {course.code}
                    </div>
                </div>
            </div>

            {/* COURSE DETAILS */}
            <div className="course-section">
                <div className="heading">
                    <i className="fa-solid fa-circle-info"></i>
                    <span>Course Information</span>
                </div>

                <div className="details">
                    <div className="details-box">
                        <div className="detail-name">DEPARTMENT</div>
                        <div className="detail-value">{course.department}</div>
                    </div>

                    <div className="details-box">
                        <div className="detail-name">CREDIT HOURS</div>
                        <div className="detail-value">{course.creditHours}</div>
                    </div>

                    <div className="details-box">
                        <div className="detail-name">SEMESTER</div>
                        <div className="detail-value">{course.semester}</div>
                    </div>

                    <div className="details-box">
                        <div className="detail-name">INSTRUCTOR</div>
                        <div className="detail-value">{course.instructor}</div>
                    </div>
                </div>
            </div>

            {/* ENROLLED STUDENTS */}
            <div className="course-section">
                <div className="heading">
                    {userRole === 'Student' ? <i className="fa-solid fa-chart-line"></i> : <i className="fa-solid fa-users"></i>}

                    {userRole === 'Student' ? <span>My Result</span> : <span>Enrolled Students</span>}
                </div>

                <div className="table-container">
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Marks</th>
                            </tr>
                        </thead>

                        <tbody>
                            {enrolledStudents.map(student => {
                                const result = student.results.find(
                                    r => r.courseCode === courseCode
                                );

                                return (
                                    <tr key={student.id}>
                                        <td>{student.id}</td>
                                        <td>{student.name}</td>
                                        <td>{result?.marks || '-'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* STATISTICS */}
            {userRole !== 'Student' && <div className="course-section">
                <div className="heading">
                    <i className="fa-solid fa-chart-column"></i>
                    <span>Course Statistics</span>
                </div>

                <div className="details">
                    <div className="details-box">
                        <div className="detail-name">TOTAL STUDENTS</div>
                        <div className="detail-value">
                            {enrolledStudents.length}
                        </div>
                    </div>

                    <div className="details-box">
                        <div className="detail-name">AVERAGE MARKS</div>
                        <div className="detail-value">
                            {averageMarks}
                        </div>
                    </div>
                </div>
            </div>}

        </div>
    );
};

export default CourseProfile;