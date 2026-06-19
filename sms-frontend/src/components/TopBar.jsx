import { useState, useEffect } from 'react';
import '../css/common.css';
import '../css/responsive.css';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

function TopBar() {
    const { token, logout } = useContext(AuthContext);

    const [username, setUsername] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setUsername('');
            return;
        }

        const fetchUser = async () => {
            try {
                let userID = null;
                if (token) {
                    const decoded = jwtDecode(token);
                    userID = decoded.userID;
                }

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/${userID}`);

                if (res.data && res.data.username) {
                    setUsername(res.data.username);
                }

            } catch (err) {
                console.error("Error fetching username inside TopBar:", err);
            }
        }

        fetchUser();

    }, [token])

    function handleLogout() {
        alert('Sucessfully Logged Out!');
        logout();
        navigate('/login');
    }

    return (
            <div className="topbar-section">
                <div className="profile-section">
                    {
                        !token ? (
                            <div className='auth-buttons'>
                                <Link className="auth-btn" to="/login">
                                    Login
                                </Link>

                                <Link className="auth-btn" to="/signup">
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <div className='user-section'>
                                <span className="username">
                                    Hi, {username || 'User'}
                                </span>

                                <button onClick={() => handleLogout()} className="auth-btn logout">
                                    Logout
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
    );
}

export default TopBar;
