import { NavLink, useNavigate, Link } from 'react-router-dom';
import '../css/common.css';
import '../css/responsive.css';
import { jwtDecode } from 'jwt-decode';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../store/AuthContext';

function Sidebar() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    // Close sidebar when clicking a link on mobile
    const handleNavClick = () => {
        setIsOpen(false);
    };

    let userRole = null;
    let userID = null;

    if (token) {
        const decoded = jwtDecode(token);
        userID = decoded.userID;
        userRole = decoded.role;
    }

    return (
        <>
            {/* Hamburger button - only visible on mobile */}
            <button
                className={`hamburger-btn ${isOpen ? 'hamburger-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
            )}

            <div className={`left-side ${isOpen ? 'sidebar-mobile-open' : ''}`}>
                <Link to={'/'} className="logo">
                    <i className="main-logo fa-solid fa-graduation-cap"></i>
                    <span>SMS</span>
                </Link>

                <div className="navigations">
                    <NavLink className="nav-links" to="/" end onClick={handleNavClick}>
                        <i className="fa-solid fa-chart-pie"></i> Dashboard
                    </NavLink>

                    {
                        (userRole === 'Admin' || userRole === 'Teacher') && <NavLink className="nav-links" to="/student-list" onClick={handleNavClick}>
                            <i className="fa-solid fa-users"></i> Student List
                        </NavLink>
                    }

                    {
                        userRole === 'Admin' && <NavLink className="nav-links" to="/add-student" onClick={handleNavClick}>
                            <i className="fa-solid fa-user-plus"></i> Add Student
                        </NavLink>
                    }

                    <NavLink className="nav-links" to="/teacher-list" onClick={handleNavClick}>
                        <i className="fa-solid fa-users"></i> Teacher List
                    </NavLink>

                    {
                        userRole === 'Admin' && <NavLink className="nav-links" to="/add-teacher" onClick={handleNavClick}>
                            <i className="fa-solid fa-user-plus"></i> Add Teacher
                        </NavLink>
                    }

                    <NavLink className="nav-links" to="/courses" onClick={handleNavClick}>
                        <i className="fa-solid fa-book-bookmark"></i> {userRole !== 'Student' ? 'Manage Courses' : 'View Courses'}
                    </NavLink>

                    <NavLink className="nav-links" to="/attendance" onClick={handleNavClick}>
                        <i className="fa-solid fa-calendar-check"></i> {userRole !== 'Student' ? 'Mark Attendance' : 'Check Attendance'}
                    </NavLink>

                    {
                        (userRole === 'Admin' || userRole === 'Teacher') && <NavLink className="nav-links" to="/add-result" end onClick={handleNavClick}>
                            <i className="fa-solid fa-file-invoice"></i> Add Result
                        </NavLink>
                    }

                    <NavLink className="nav-links" to="/grade-criteria" onClick={handleNavClick}>
                        <i className="fa-solid fa-graduation-cap"></i> Grades &amp; GPA
                    </NavLink>

                    <NavLink className="nav-links" to="/sms-ai" onClick={handleNavClick}>
                        <i className="fa-solid fa-robot"></i> SMS AI
                    </NavLink>

                    {
                        token ? <NavLink className="nav-links"
                            to={
                                userRole === 'Student' ? `/studentProfile?id=${userID}`
                                    : userRole === 'Teacher' ? `/teacherProfile?id=${userID}`
                                        : userRole === 'Admin' ? `/adminProfile?id=${userID}` : '/'
                            }
                            onClick={handleNavClick}
                        >
                            <i className="fa-solid fa-circle-user"></i> My Profile
                        </NavLink> : ''
                    }
                </div>
            </div>
        </>
    );
}

export default Sidebar;
