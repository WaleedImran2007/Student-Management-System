import { useNavigate } from "react-router-dom";
import "../css/noPermission.css";
import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";

const NoPermission = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    return (
        <div className="permission-container">

            <div className="permission-card">

                <div className="lock-icon">
                    <i className="fa-solid fa-lock"></i>
                </div>

                { token ? <h1>Access Denied</h1> : <h1>Login Required</h1> }

                <p>
                    You don't have permission to access this page.
                    <br />
                    Please contact the administrator if you think this is a mistake.
                </p>

                <div className="permission-actions">
                    {
                        token ? (<>
                            <button
                                onClick={() => navigate(-2)}
                                className="back-btn"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                Go Back
                            </button> <button
                                onClick={() => navigate("/")}
                                className="home-btn"
                            >
                                <i className="fa-solid fa-house"></i>
                                Home
                            </button>
                        </>) : <button
                            onClick={() => navigate("/login")}
                            className="home-btn"
                        >
                            <i className="fa-solid fa-house"></i>
                            Go To Login
                        </button>
                    }

                </div>


            </div>


        </div>
    )
}

export default NoPermission;
