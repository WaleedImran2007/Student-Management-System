import { useLocation } from "react-router-dom";
import '../css/studentProfile.css';
import hero from "../assets/hero.png";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

const TeacherProfile = () => {

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const profileID = query.get("id");

    const token = localStorage.getItem('token');

    const teacherAPI = `${import.meta.env.VITE_API_URL}/api/teachers`;

    const [teacher, setTeacher] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchTeacher = async () => {
            try {

                const res = await axios.get(`${teacherAPI}/${profileID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setTeacher(res.data);

            } catch(err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        fetchTeacher();

    }, [profileID]);


    if(loading) return <Loader />

    return (
        <>

        <div className="profile-container">


            {/* FIRST SECTION */}
            <div className="name-img-section">

                <div className="student-img">
                    <img src={hero} alt="profile" />
                </div>


                <div className="student-id-name">

                    <div className="name">
                        {teacher.name?.toUpperCase()}
                    </div>


                    <div className="id">

                        <i className="fa-solid fa-id-card"></i>

                        TEACHER ID: {teacher.id}

                    </div>

                </div>

            </div>




            {/* DETAILS */}

            <div className="student-details">


                <div className="heading">

                    <i className="fa-solid fa-chalkboard-user"></i>

                    <span>
                        Professional Information
                    </span>

                </div>



                <div className="details">


                    <div className="department details-box">

                        <div className="detail-name">
                            DEPARTMENT
                        </div>

                        <div className="detail-value">
                            {teacher.department}
                        </div>

                    </div>



                    <div className="email details-box">

                        <div className="detail-name">
                            EMAIL
                        </div>

                        <div className="detail-value">
                            {teacher.email}
                        </div>

                    </div>



                    <div className="gender details-box">

                        <div className="detail-name">
                            GENDER
                        </div>

                        <div className="detail-value">
                            {teacher.gender}
                        </div>

                    </div>




                    <div className="age details-box">

                        <div className="detail-name">
                            AGE
                        </div>

                        <div className="detail-value">
                            {teacher.age}
                        </div>

                    </div>





                    <div className="phone details-box">

                        <div className="detail-name">
                            PHONE
                        </div>

                        <div className="detail-value">
                            {teacher.phone}
                        </div>

                    </div>




                    <div className="semester details-box">

                        <div className="detail-name">
                            DESIGNATION
                        </div>

                        <div className="detail-value">
                            {teacher.designation}
                        </div>

                    </div>



                </div>


            </div>





            {/* EXPERIENCE */}

            <div className="result-details">


                <div className="heading">

                    <i className="fa-solid fa-briefcase"></i>

                    <span>
                        Experience
                    </span>

                </div>



                <div className="table-container">

                    <p>
                        {teacher.experience}
                    </p>

                </div>

            </div>

        </div>

        </>
    )
}


export default TeacherProfile;