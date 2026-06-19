import { Link } from 'react-router-dom';
import '../css/landingPage.css';
import Footer from '../components/Footer';

function LandingPage() {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <div className="landing-hero">
                <div className="landing-hero-content">
                    <div className="landing-logo">
                        <i className="fa-solid fa-graduation-cap"></i>
                        <span>SMS</span>
                    </div>
                    <h1>Student Management System</h1>
                    <p className="landing-tagline">
                        A complete platform for managing students, teachers, courses, attendance, and results — all in one place.
                    </p>
                    <div className="landing-hero-actions">
                        <Link to="/login" className="landing-btn-primary">
                            <i className="fa-solid fa-right-to-bracket"></i> Login
                        </Link>
                        <Link to="/signup" className="landing-btn-secondary">
                            <i className="fa-solid fa-user-plus"></i> Sign Up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="landing-section">
                <h2 className="landing-section-title">What You Can Do</h2>
                <div className="features-grid">
                    {[
                        { icon: 'fa-users', color: 'blue', title: 'Student Management', desc: 'Add, view, update, and delete student records. Keep all student information organized.' },
                        { icon: 'fa-chalkboard-user', color: 'green', title: 'Teacher Management', desc: 'Manage teacher profiles, assign departments, and maintain faculty records.' },
                        { icon: 'fa-book-bookmark', color: 'purple', title: 'Course Management', desc: 'Create and manage courses, assign teachers, and track enrollments.' },
                        { icon: 'fa-calendar-check', color: 'yellow', title: 'Attendance Tracking', desc: 'Mark and review daily attendance. Teachers and admins can record presence/absence.' },
                        { icon: 'fa-file-invoice', color: 'red', title: 'Results & Grades', desc: 'Add results per course, auto-calculate GPA, and view grade breakdowns.' },
                        { icon: 'fa-chart-pie', color: 'teal', title: 'Dashboard Analytics', desc: 'Visual dashboard with live stats, attendance trends, and department distribution.' },
                    ].map((f) => (
                        <div className={`feature-card feature-card-${f.color}`} key={f.title}>
                            <div className={`feature-icon feature-icon-${f.color}`}>
                                <i className={`fa-solid ${f.icon}`}></i>
                            </div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How it works */}
            <div className="landing-section landing-section-alt">
                <h2 className="landing-section-title">How to Use</h2>
                <div className="steps-list">
                    <div className="step-item">
                        <div className="step-num">1</div>
                        <div className="step-content">
                            <h3>Sign Up</h3>
                            <p>Only registered students and teachers from the university can sign up. Your email must already exist in the system. If you're an admin, only the admin email is allowed.</p>
                        </div>
                    </div>
                    <div className="step-item">
                        <div className="step-num">2</div>
                        <div className="step-content">
                            <h3>Verify Your Email</h3>
                            <p>After signing up, a verification email will be sent from <strong>imrankhalida2009@gmail.com</strong>. Click the link to activate your account.</p>
                        </div>
                    </div>
                    <div className="step-item">
                        <div className="step-num">3</div>
                        <div className="step-content">
                            <h3>Login & Explore</h3>
                            <p>Once verified, log in with your credentials. Your role (Student, Teacher, or Admin) determines what you can access.</p>
                        </div>
                    </div>
                    <div className="step-item">
                        <div className="step-num">4</div>
                        <div className="step-content">
                            <h3>Use the Features</h3>
                            <p>Navigate using the sidebar. Admins have full access. Teachers can manage attendance and results. Students can view their own data.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Demo Accounts */}
            <div className="landing-section">
                <h2 className="landing-section-title">Try It Out — Demo Accounts</h2>
                <p className="landing-demo-note">
                    These accounts are pre-verified so you can explore the system without signing up.
                </p>
                <div className="demo-cards">
                    <div className="demo-card demo-student">
                        <div className="demo-card-header">
                            <i className="fa-solid fa-user-graduate"></i>
                            <span>Student Demo</span>
                        </div>
                        <div className="demo-field">
                            <span className="demo-label">Email</span>
                            <code>demostudent@gmail.com</code>
                        </div>

                        <div className="demo-field">
                            <span className="demo-label">Password</span>
                            <code>123</code>
                        </div>

                        <div className="demo-field">
                            <span className="demo-label">Role</span>
                            <span className="demo-role student-role">Student</span>
                        </div>
                        <p className="demo-desc">Can view own profile, check attendance, browse courses and grades.</p>
                    </div>

                    <div className="demo-card demo-teacher">
                        <div className="demo-card-header">
                            <i className="fa-solid fa-chalkboard-user"></i>
                            <span>Teacher Demo</span>
                        </div>
                        
                        <div className="demo-field">
                            <span className="demo-label">Email</span>
                            <code>demoteacher@gmail.com</code>
                        </div>

                        <div className="demo-field">
                            <span className="demo-label">Password</span>
                            <code>123</code>
                        </div>

                        <div className="demo-field">
                            <span className="demo-label">Role</span>
                            <span className="demo-role teacher-role">Teacher</span>
                        </div>
                        <p className="demo-desc">Can view students, mark attendance, add results, manage courses.</p>
                    </div>
                </div>

                <div className="demo-disclaimer">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <p>
                        These demo accounts are for <strong>portfolio demonstration only</strong>. They will be removed before this project is used in a real university environment.
                    </p>
                </div>
            </div>

            {/* Roles Section */}
            <div className="landing-section landing-section-alt">
                <h2 className="landing-section-title">Access Control by Role</h2>
                <div className="roles-table-wrapper">
                    <table className="roles-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th><i className="fa-solid fa-user-shield"></i> Admin</th>
                                <th><i className="fa-solid fa-chalkboard-user"></i> Teacher</th>
                                <th><i className="fa-solid fa-user-graduate"></i> Student</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ['View Dashboard', '✅', '✅', '✅'],
                                ['View Student List', '✅', '✅', '❌'],
                                ['Add/Edit Students', '✅', '❌', '❌'],
                                ['View Teacher List', '✅', '✅', '✅'],
                                ['Add/Edit Teachers', '✅', '❌', '❌'],
                                ['Manage Courses', '✅', '✅', '👁️ View'],
                                ['Mark Attendance', '✅', '✅', '👁️ Own'],
                                ['Add Results', '✅', '✅', '❌'],
                                ['View Own Profile', '✅', '✅', '✅'],
                            ].map(([feat, ...perms]) => (
                                <tr key={feat}>
                                    <td>{feat}</td>
                                    {perms.map((p, i) => <td key={i}>{p}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CTA */}
            <div className="landing-cta">
                <h2>Ready to get started?</h2>
                <p>Sign up with your university email or try a demo account above.</p>
                <div className="landing-hero-actions">
                    <Link to="/login" className="landing-btn-primary">
                        <i className="fa-solid fa-right-to-bracket"></i> Login Now
                    </Link>
                    <Link to="/signup" className="landing-btn-secondary">
                        <i className="fa-solid fa-user-plus"></i> Create Account
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default LandingPage;
