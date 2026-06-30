import { useLocation, useNavigate } from "react-router-dom";
import '../css/studentProfile.css'
import hero from "../assets/hero.png";
import { useEffect } from "react";
import api from '../api/api.js';
import { useState } from "react";
import Loader from "../components/Loader";

const StudentProfile = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const profileID = query.get("id");

    const token = localStorage.getItem('token');

    const [student, setStudent] = useState({});
    const [courseArray, setCourseArray] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const studentRes = await api.get(`/students/${profileID}`);

                const courseRes = await api.get('/courses');

                setStudent(studentRes.data);
                setCourseArray(courseRes.data);


            } catch (err) {
                console.log(err);
                if(err.response?.status === 403) {
                    navigate('/no-permission');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, [profileID])

    const getGpaAndClass = (marks) => {
        const score = Number(marks);

        let gpa, gpaClass;

        if (score >= 85) {
            gpa = "4.0";
            gpaClass = "gpa-high";
        } else if (score >= 80) {
            gpa = "3.7";
            gpaClass = "gpa-high";
        } else if (score >= 75) {
            gpa = "3.3";
            gpaClass = "gpa-high";
        } else if (score >= 70) {
            gpa = "3.0";
            gpaClass = "gpa-high";
        } else if (score >= 65) {
            gpa = "2.7";
            gpaClass = "gpa-mid";
        } else if (score >= 60) {
            gpa = "2.3";
            gpaClass = "gpa-mid";
        } else if (score >= 55) {
            gpa = "2.0";
            gpaClass = "gpa-mid";
        } else if (score >= 50) {
            gpa = "1.7";
            gpaClass = "gpa-mid";
        } else {
            gpa = "0.0";
            gpaClass = "gpa-low";
        }

        return { gpa, gpaClass };
    }

    let totalQualityPoints = 0;
    let totalCreditHours = 0;

    student.results?.forEach((result) => {
        const course = courseArray.find(c => c.code === result.courseCode);

        if (!course) {
            console.warn(`Course code ${result.courseCode} not found in course list!`);
            return; // Skip to the next loop iteration safely
        }

        const creditHours = Number(course.creditHours) || 0;
        let { gpa } = getGpaAndClass(result.marks);
        gpa = Number(gpa) || 0;

        totalCreditHours += creditHours;
        totalQualityPoints += (gpa * course.creditHours);
    })

    const cgpa = (totalQualityPoints / totalCreditHours).toFixed(2);

    if(loading) return <Loader />

    return <>
        <div className="profile-container">

            {/* FIRST SECTION */}
            <div className="name-img-section">
                <div className="student-img">
                    <img src={hero} alt="profile-picture" />
                </div>

                <div className="student-id-name">
                    <div className="name">
                        {student?.name?.toUpperCase()}
                    </div>

                    <div className="id">
                        <i className="fa-solid fa-id-card"></i>
                        STUDENT ID: {student.id}
                    </div>
                </div>

            </div>

            {/* SECOND SECTION */}
            <div className="student-details">
                <div className="heading">
                    <i className="fa-solid fa-graduation-cap"></i>
                    <span>Academic and Personal Information</span>
                </div>

                <div className="details">

                    <div className="department details-box">
                        <div className="detail-name">DEPARTMENT</div>
                        <div className="detail-value">{student.department}</div>
                    </div>

                    <div className="email details-box">
                        <div className="detail-name">EMAIL</div>
                        <div className="detail-value">{student.email}</div>
                    </div>

                    <div className="gender details-box">
                        <div className="detail-name">GENDER</div>
                        <div className="detail-value">{student.gender}</div>
                    </div>

                    <div className="age details-box">
                        <div className="detail-name">AGE</div>
                        <div className="detail-value">{student.age}</div>
                    </div>

                    <div className="phone details-box">
                        <div className="detail-name">PHONE</div>
                        <div className="detail-value">{student.phone}</div>
                    </div>

                    <div className="semester details-box">
                        <div className="detail-name">SEMESTER</div>
                        <div className="detail-value">{student.semester}</div>
                    </div>

                </div>

            </div>

            {/* THIRD SECTION */}
            <div className="result-details">
                <div className="heading">
                    <i className="fa-solid fa-chart-line"></i>
                    <span>Academic Report Card</span>
                </div>

                <div className="table-container">

                    <table className="result-container">
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Marks</th>
                                <th>GPA</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                student.results?.map((result, index) => {
                                    const marks = result.marks;
                                    let { gpa, gpaClass } = getGpaAndClass(marks);

                                    return <tr key={index}>
                                        <td>{result.courseCode}</td>
                                        <td>{result.marks}</td>
                                        <td className={gpaClass}>{gpa}</td>

                                    </tr>
                                })
                            }

                        </tbody>

                    </table>

                </div>

            </div>

            {/* FOURTH SECTION */}
            <div className="result-details">
                <div className="heading">
                    <i className="fa-solid fa-trophy"></i>
                    <span>CGPA: </span>
                    <span>{cgpa}</span>

                </div>

            </div>

        </div>
    </>
}

export default StudentProfile;