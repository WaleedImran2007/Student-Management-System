import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../store/AuthContext';
import { jwtDecode } from 'jwt-decode';
import '../css/common.css';
import '../css/adminProfile.css';
import '../css/responsive.css';
import Loader from '../components/Loader';
import api from '../api/api.js';

function AdminProfile() {
    const { token, logout } = useContext(AuthContext);
    const [admin, setAdmin] = useState(null);
    const [stats, setStats] = useState({ students: 0, courses: 0, teachers: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const decoded = jwtDecode(token);
                const headers = { Authorization: `Bearer ${token}` };

                const userRes = await api.get(`/auth/${decoded.userID}`);

                setAdmin(userRes?.data || { username: decoded.email?.split('@')[0], email: decoded.email, role: 'Admin', id: decoded.userID });

                const [sRes, cRes] = await Promise.allSettled([
                    api.get(`/students/totalStudents`),

                    api.get(`/courses/totalCourses`),
                ]);

                setStats({
                    students: sRes.status === 'fulfilled' ? sRes.value.data : 0,
                    courses: cRes.status === 'fulfilled' ? cRes.value.data : 0,
                });

                // Set admin from decoded token if API fails
                if (decoded) {
                    setAdmin(prev => prev || { username: decoded.email?.split('@')[0], email: decoded.email, role: 'Admin', id: decoded.userID });
                }

            } catch (err) {
                console.error(err);
                if (token) {
                    const decoded = jwtDecode(token);
                    setAdmin({ username: 'Admin', email: decoded.email, role: 'Admin', id: decoded.userID });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (loading) return <Loader />

    return (
        <div className="admin-profile-page">
            <div className="admin-profile-heading">ADMIN PROFILE</div>

            <div className="admin-profile-wrapper">
                {/* Avatar Card */}
                <div className="admin-avatar-card">
                    <div className="admin-avatar-circle">
                        <i className="fa-solid fa-user-shield"></i>
                    </div>
                    <div className="admin-name">{admin?.username || 'Admin'}</div>
                    <div className="admin-role-badge">
                        <i className="fa-solid fa-crown"></i> Administrator
                    </div>
                    <div className="admin-id-tag">ID: {admin?.id || 'A-01'}</div>
                </div>

                {/* Info Card */}
                <div className="admin-info-section">
                    <div className="admin-info-card">
                        <h3><i className="fa-solid fa-circle-info"></i> Account Information</h3>
                        <div className="admin-info-grid">
                            <div className="admin-info-item">
                                <span className="info-label">Username</span>
                                <span className="info-value">{admin?.username || '—'}</span>
                            </div>
                            <div className="admin-info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{admin?.email || '—'}</span>
                            </div>
                            <div className="admin-info-item">
                                <span className="info-label">Role</span>
                                <span className="info-value">
                                    <span className="role-chip">Admin</span>
                                </span>
                            </div>
                            <div className="admin-info-item">
                                <span className="info-label">Admin ID</span>
                                <span className="info-value">{admin?.id || 'A-01'}</span>
                            </div>
                            <div className="admin-info-item">
                                <span className="info-label">Account Status</span>
                                <span className="info-value">
                                    <span className="status-verified">
                                        <i className="fa-solid fa-circle-check"></i> Verified
                                    </span>
                                </span>
                            </div>
                            <div className="admin-info-item">
                                <span className="info-label">Member Since</span>
                                <span className="info-value">
                                    {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="admin-stats-row">
                        <div className="admin-stat-card">
                            <div className="admin-stat-icon students-icon">
                                <i className="fa-solid fa-users"></i>
                            </div>
                            <div className="admin-stat-info">
                                <div className="admin-stat-num">{stats.students}</div>
                                <div className="admin-stat-label">Total Students</div>
                            </div>
                        </div>

                        <div className="admin-stat-card">
                            <div className="admin-stat-icon courses-icon">
                                <i className="fa-solid fa-book-bookmark"></i>
                            </div>
                            <div className="admin-stat-info">
                                <div className="admin-stat-num">{stats.courses}</div>
                                <div className="admin-stat-label">Active Courses</div>
                            </div>
                        </div>

                        <div className="admin-stat-card">
                            <div className="admin-stat-icon perms-icon">
                                <i className="fa-solid fa-key"></i>
                            </div>
                            <div className="admin-stat-info">
                                <div className="admin-stat-num">Full</div>
                                <div className="admin-stat-label">Access Level</div>
                            </div>
                        </div>
                    </div>

                    {/* Permissions Card */}
                    <div className="admin-permissions-card">
                        <h3><i className="fa-solid fa-shield-halved"></i> Admin Permissions</h3>
                        <div className="permissions-grid">
                            {[
                                { icon: 'fa-user-plus', label: 'Add Students' },
                                { icon: 'fa-user-minus', label: 'Remove Students' },
                                { icon: 'fa-chalkboard-teacher', label: 'Manage Teachers' },
                                { icon: 'fa-book', label: 'Manage Courses' },
                                { icon: 'fa-calendar-check', label: 'Mark Attendance' },
                                { icon: 'fa-file-invoice', label: 'Add Results' },
                                { icon: 'fa-users-cog', label: 'User Management' },
                                { icon: 'fa-chart-bar', label: 'View Reports' },
                            ].map((perm) => (
                                <div key={perm.label} className="permission-chip">
                                    <i className={`fa-solid ${perm.icon}`}></i>
                                    <span>{perm.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
