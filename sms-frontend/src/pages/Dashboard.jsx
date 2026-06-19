import { useContext, useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';

import '../css/common.css';
import '../css/dashboard.css';
import '../css/responsive.css';

import { AuthContext } from '../store/AuthContext';
import axios from 'axios';
import { useAsyncValue } from 'react-router-dom';

Chart.register(...registerables);

function Dashboard() {
    const lineRef = useRef(null);
    const pieRef = useRef(null);
    const lineChart = useRef(null);
    const pieChart = useRef(null);

    const [totalStudents, setTotalStudents] = useState(0);
    const [activeCourses, setActiveCourses] = useState(0);
    const [presentToday, setPresentToday] = useState(0);
    const [recentStudents, setRecentStudents] = useState([]);
    const [deptData, setDeptData] = useState([]);

    const [weeklyTrend, setWeeklyTrend] = useState([]);

    const [loading, setLoading] = useState(true);

    const { token } = useContext(AuthContext);

    const API = `${import.meta.env.VITE_API_URL}/api`;

    useEffect(() => {
        if (!token) return;

        const fetchDashboardData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };

                const studentsRes = await axios.get(`${API}/students/totalStudents`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const coursesRes = await axios.get(`${API}/courses/totalCourses`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const presentRes = await axios.get(`${API}/attendances/todayPresent`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });


                const recentRes = await axios.get(`${API}/students/recent`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const deptRes = await axios.get(`${API}/students/byDepartment`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('By Department Data: ', deptRes.data);

                const trendRes = await axios.get(`${API}/attendances/weeklyTrend`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (studentsRes) setTotalStudents(studentsRes.data);
                if (coursesRes) setActiveCourses(coursesRes.data);
                if (presentRes) setPresentToday(presentRes.data);
                if (recentRes) setRecentStudents(recentRes.data);
                if (deptRes) setDeptData(deptRes.data);
                if (trendRes) setWeeklyTrend(trendRes.data);

            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);


    useEffect(() => {
        if (lineChart.current) lineChart.current.destroy();
        if (pieChart.current) pieChart.current.destroy();

        lineChart.current = new Chart(lineRef.current, {
            type: 'line',
            data: {
                // weekly Trend is like this: [
                //  {
                //   "date":"2026-06-01",
                //   "label":"Mon",
                //   "percentage":80
                //  },
                //  {
                //   "date":"2026-06-02",
                //   "label":"Tue",
                //   "percentage":100
                //  }
                // ]
            
                labels: weeklyTrend
                        .filter(item => item.label !== 'Sun')
                        .map(item => item.label),

                datasets: [{
                    label: 'Attendance %',
                    data: weeklyTrend
                            .filter(item => item.label !== 'Sun')
                            .map(item => item.percentage),
                    borderWidth: 3,
                    borderColor: '#2563EB',
                    pointHoverRadius: 7,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        max: 120,
                        beginAtZero: true,
                        ticks: {
                            stepSize: 20,
                            callback: value => value + '%'
                        },
                        grid: { color: '#F1F5F9' },
                    }
                }
            }
        });

        pieChart.current = new Chart(pieRef.current, {
            type: 'pie',
            data: {
                labels: deptData.map(item => item._id),
                datasets: [{
                    data: deptData.map(item => item.count),
                    backgroundColor: ['#2563EB', '#22C55E', '#F59E0B'],
                    hoverOffset: 4
                }]
            }
        });



        return () => {
            if (lineChart.current) lineChart.current.destroy();
            if (pieChart.current) pieChart.current.destroy();
        };
    }, [weeklyTrend]);

    return <>
        <div className="dashboard-heading">DASHBOARD</div>

        <div className="statistics">
            <div className="statistics-block">
                <div>
                    <div className="stats-heading">Total Students</div>
                    <div className="stats-number">{totalStudents}</div>
                </div>
                <div className="statistics-icon">
                    <i className="fa-solid fa-user-group"></i>
                </div>
            </div>

            <div className="statistics-block">
                <div>
                    <div className="stats-heading">Active Courses</div>
                    <div className="stats-number">{activeCourses}</div>
                </div>
                <div className="statistics-icon">
                    <i className="fa-regular fa-file-lines text-icon"></i>
                </div>
            </div>

            <div className="statistics-block">
                <div>
                    <div className="stats-heading">Students Present Today</div>
                    <div className="stats-number">{presentToday}</div>
                </div>
                <div className="statistics-icon">
                    <i className="fa-solid fa-user-check"></i>
                </div>
            </div>

            <div className="statistics-block">
                <div>
                    <div className="stats-heading">Total Departments</div>
                    <div className="stats-number">{deptData.length || 3}</div>
                </div>
                <div className="statistics-icon">
                    <i className="fa-solid fa-building-columns"></i>
                </div>
            </div>
        </div>

        <div className="attendance-trend">
            <h3>Weekly Attendance Trend</h3>
            <div className="chart-container">
                <canvas ref={lineRef}></canvas>
            </div>
        </div>

        <div className="bottom-row-container">
            <div className="student-distribution">
                <h3>Students by Department</h3>
                <div className="chart-container">
                    <canvas ref={pieRef}></canvas>
                </div>
            </div>

            <div className="recent-students">
                <div className="recent-students-header">
                    <h3>Recent Students</h3>
                </div>

                <div className="table-responsive">
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>ID</th>
                                <th>Department</th>
                                <th>Semester</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentStudents.length > 0 ? (
                                recentStudents.map((s) => (
                                    <tr key={s.id}>
                                        <td>{s.name}</td>
                                        <td className="text-muted">{s.id}</td>
                                        <td>{s.department}</td>
                                        <td><span className="badge badge-success">{s.semester}</span></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                                        No students added yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
}

export default Dashboard;
