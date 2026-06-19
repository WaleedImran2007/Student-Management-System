import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import "../css/noPermission.css";

const VerifyToken = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        const verify = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify/${token}`);
            } catch (err) {
                console.log(err);
            }
        }

        verify();

    }, [token]);

    return <>
        <div className="permission-container">

            <div className="permission-card">

                <div className="lock-icon">
                    <i className="fa-solid fa-envelope-circle-check"></i>
                </div>

                <h1>Email Verified Successfully ✅</h1>
                <p>
                    Thank you for verifying your email address. Your account security has been updated, and everything is ready to go. Click below to log in and start exploring your dashboard.
                </p>

                <div className="permission-actions">
                    <button
                            onClick={() => navigate("/login")}
                            className="home-btn"
                        >
                            <i className="fa-solid fa-house"></i>
                            Go To Login
                        </button>
                </div>


            </div>


        </div>
    </>
}

export default VerifyToken;