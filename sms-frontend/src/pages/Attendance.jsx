import { useState, useEffect } from 'react';
import api from '../api/api.js';
import { jwtDecode } from 'jwt-decode';

import '../css/common.css';
import '../css/attendance.css';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

function Attendance() {
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];

    const token = localStorage.getItem('token');

    let userRole = null;
    let userID = null;

    if (!token) {
        navigate('/login');
    }

    else if (token) {
        const decoded = jwtDecode(token);
        userRole = decoded.role;
        userID = decoded.userID;
    }

    const [selectedDate, setSelectedDate] = useState(today);
    const [studentArray, setStudentArray] = useState();
    const [attendanceMap, setAttendanceMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => { // FETCHING STUDENTS
        const fetchStudents = async () => {
            try {
                const studentRes = await api.get('/students');

                setStudentArray(studentRes.data);
            } catch (err) {
                console.error("Failed to load students", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchMyAttendance = async () => {
            try {
                const studentRes = await api.get(`/students/${userID}`);

                setStudentArray([studentRes.data]);
            } catch (err) {
                console.error("Failed to load students", err);
            } finally {
                setLoading(false);
            }
        }

        userRole === 'Student' ? fetchMyAttendance() : fetchStudents();
    }, []);

    useEffect(() => { // FETCHING ATTENDANCE FOR A SELECTED DATE
        const fetchAttendanceForDate = async () => {
            try {
                const map = {};

                // Set default status to 'Present' for all existing students
                studentArray.forEach(s => {
                    map[s.id] = 'Present';
                });

                try {
                    const attendanceRes = await api.get(`/attendances/${selectedDate}`);

                    const dayRecord = attendanceRes.data;

                    if (dayRecord && dayRecord.records) {
                        dayRecord.records.forEach(r => {
                            map[r.studentID] = r.status;
                        });
                    }

                } catch (err) {
                    if (err.response?.status !== 404) {
                        console.error("Error fetching daily records", err);
                    }
                }

                setAttendanceMap(map);
            } catch (err) {
                console.error(err);
            }
        };

        if (studentArray?.length > 0) {
            fetchAttendanceForDate();
        }

    }, [selectedDate, studentArray]);



    function handleSelectChange(studentId, value) {
        setAttendanceMap(prev => ({ ...prev, [studentId]: value }));
    }


    async function saveAttendance() {
        setSaveLoading(true);
        try {
            const attendanceRecords = studentArray.map(s => ({
                studentID: parseInt(s.id),
                status: attendanceMap[s.id] || 'Present'
            }));

            const newAttendance = { date: selectedDate, records: attendanceRecords };

            let recordExists = false;

            try {
                await api.get(`/attendances/${selectedDate}`);
                recordExists = true;
            } catch (err) {
                if (err.response?.status !== 404) throw err;
            }

            if (recordExists) {
                await api.put(`/attendances/${selectedDate}`, newAttendance);
            } else {
                await api.post('/attendances', newAttendance);
            }

            alert(`Attendance for Date ${selectedDate} is saved successfully`);
        }

        catch (err) {
            console.error("Error saving attendance", err);
            alert("Failed to save attendance.");
        }

        finally {
            setSaveLoading(false);
        }
    }


    if (loading) return <Loader />

    return <>
        <div className="list-header-row">
            <div className="date-picker-box">
                <label htmlFor="attendanceDate">Select Date:</label>
                <input
                    type="date"
                    id="attendanceDate"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                />
            </div>
        </div>

        <div className="table-card-wrapper">
            <div className="table-responsive">
                <table className="attendance-master-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th style={{ width: '200px' }}>Mark Attendance</th>
                        </tr>
                    </thead>
                    <tbody id="attendance-table-body">
                        {studentArray?.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', color: '#64748B', padding: '30px' }}>
                                    No registered student profiles available to track.
                                </td>
                            </tr>
                        ) : (
                            studentArray?.map(student => {
                                const status = attendanceMap[student.id] || 'Present';
                                const themeClass = status === 'Present' ? 'select-present' : 'select-absent';
                                return (
                                    <tr key={student.id}>
                                        <td>{student.id}</td>
                                        <td><strong>{student.name}</strong></td>
                                        <td>{student.department}</td>
                                        <td>
                                            <select
                                                className={`attendance-select ${themeClass}`}
                                                data-student-id={student.id}
                                                value={status}
                                                onChange={e => handleSelectChange(student.id, e.target.value)}
                                            >
                                                <option value="Present">✓ Present</option>
                                                <option value="Absent">✗ Absent</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {
                userRole !== 'Student' && <div className="form-actions" style={{ marginTop: '24px' }}>
                    <center>
                        {
                            saveLoading ? <button style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }} className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status">Saving Attendance Record...</span>
                            </button> : <button id="saveAttendanceBtn" className="add-btn-primary" onClick={saveAttendance}>
                            <i className="fa-solid fa-save"></i> Save Attendance Sheet
                        </button>
                        }
                    </center>
                </div>
            }

        </div>
    </>
}

export default Attendance;
