import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import '../css/common.css';
import '../css/courses.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

function Courses() {
    const navigate = useNavigate();

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const editCode = query.get("code");

    const token = localStorage.getItem('token');

    let userRole = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded.role;
        } catch (err) {
            console.error("Invalid token format");
        }
    }

    const API = `${import.meta.env.VITE_API_URL}/api/courses`;

    const [courseArray, setCourseArray] = useState([]);

    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        'course-code': '', 'course-name': '', 'credit-hours': '',
        department: '', instructor: '', semester: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {

        async function fetchCourses() {
            try {
                const res = await axios.get(API, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCourseArray(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        const fetchCourse = async (code) => {
            if (!editCode) return;

            try {
                const res = await axios.get(`${API}/${editCode}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const course = res.data;

                if (course) {
                    setForm({
                        'course-code': course.code,
                        'course-name': course.name,
                        'credit-hours': course.creditHours,
                        department: course.department,
                        instructor: course.instructor,
                        semester: course.semester,
                    })
                }

            } catch (err) {
                console.log(err);
            }
        }

        fetchCourses();
        fetchCourse();

    }, [editCode, token]);


    function handleChange(e) {
        setForm({ ...form, [e.target.id]: e.target.value });
    }

    async function deleteCourse(code) {
        try {
            await axios.delete(`${API}/${code}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updated = courseArray.filter(c => c.code !== code);
            setCourseArray(updated);
            alert(`Course with Code ${code} deleted Successfully!`);
        } catch (err) {
            console.log(err);
        }

    }

    function editCourse(code) {
        navigate(`/courses?code=${code}`);
        setShowModal(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const courseCode = form['course-code'].trim();
        const courseName = form['course-name'].trim();
        const courseSemester = form.semester;
        const courseInstructor = form.instructor.trim();
        const courseCreditHours = form['credit-hours'];
        const courseDepartment = form.department;

        const newErrors = {};
        if (!courseCode) newErrors.codeError = 'Course Code is required';
        if (!courseName) newErrors.nameError = 'Course Name is required';
        if (!courseSemester) newErrors.semesterError = 'Semester is required';
        if (!courseInstructor) newErrors.instructorError = 'Instructor Name is required';
        if (!courseCreditHours) newErrors.creditError = 'Credit Hours is required';
        if (!courseDepartment) newErrors.deptError = 'Department is required';

        if (courseCreditHours && (Number(courseCreditHours) < 1 || Number(courseCreditHours) > 3)) {
            newErrors.creditError = 'Credit Hours must be in range 1-3';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const newCourse = {
            code: courseCode, name: courseName, creditHours: courseCreditHours,
            semester: courseSemester, department: courseDepartment, instructor: courseInstructor
        };

        try {
            if (editCode) {
                const res = await axios.put(`${API}/${editCode}`, newCourse, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const updated = [...courseArray];

                updated.forEach(course => {
                    if (course.code === editCode) {
                        course = newCourse;
                    }
                });

                setCourseArray(updated);

                alert('Course Updated Successfully!');

                setShowModal(false);

                setForm({ 'course-code': '', 'course-name': '', 'credit-hours': '', department: '', instructor: '', semester: '' });

                setErrors({});

                if (editCode) {
                    navigate('/courses');
                }
            }

            else {
                const res = await axios.post(API, newCourse, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const updated = [...courseArray, res.data];
                setCourseArray(updated);

                alert('Course Added Successfully!');
            }

        } catch (err) {
            if (err.response?.status === 409) {
                setErrors({ codeError: 'Course Code Already Registered' }),
                    alert('Course Code Already Registered')
            }
            console.log(err);
        }
    }

    let displayed = [...courseArray];

    if (filterText.trim()) {
        const q = filterText.trim().toLowerCase();
        displayed = displayed.filter(c =>
            c.code.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.department.toLowerCase().includes(q) ||
            c.instructor.toLowerCase().includes(q)
        );
    }

    if (sortBy === 'code') displayed.sort((a, b) => a.code.localeCompare(b.code));
    else if (sortBy === 'name') displayed.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'creditHours') displayed.sort((a, b) => a.creditHours - b.creditHours);


    if (loading) return <Loader />

    return <>
        <div className="list-header-row">
            <div className="course-list-heading">COURSE RECORDS</div>
            {
                userRole === 'Admin' && <button id="add-course-btn" className="add-btn-primary" onClick={() => setShowModal(true)}>
                    <i className="fa-solid fa-plus"></i> Add New Course
                </button>
            }
        </div>

        <div className="table-card-wrapper">
            <div className="table-controls">
                <div className="search-box-container">
                    <input
                        type="text"
                        id="tableFilterInput"
                        placeholder="Search by Code, Name, Instructor or department..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                </div>
                <div className="sort-container">
                    <label htmlFor="sortSelect">Sort By:</label>
                    <select id="sortSelect" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="">Select Option</option>
                        <option value="code">Code</option>
                        <option value="name">Name</option>
                        <option value="creditHours">Credit Hours</option>
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="courses-master-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Credit Hours</th>
                            <th>Instructor</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="course-table-body">
                        {displayed.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: '#64748B', padding: '30px' }}>
                                    No Courses found. Click "Add New Course" to begin.
                                </td>
                            </tr>
                        ) : (
                            displayed.map(course => (
                                <tr key={course.code}>
                                    <td>{course.code}</td>
                                    <td>{course.name}</td>
                                    <td>{course.creditHours}</td>
                                    <td>{course.instructor}</td>
                                    <td>{course.department}</td>
                                    <td>
                                        <div className="action-btn-group">
                                            <Link to={`/courseProfile?code=${course.code}`} className="action-btn btn-view">
                                                <i className="fa-solid fa-eye"></i>
                                            </Link>

                                            {userRole === 'Admin' && <button
                                                onClick={() => deleteCourse(course.code)}
                                                className="action-btn btn-delete">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>}

                                            {userRole === 'Admin' && <button
                                                onClick={() => editCourse(course.code)}
                                                className="action-btn btn-edit">
                                                <i className="fa-solid fa-edit"></i>
                                            </button>}

                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* ADD COURSE MODAL */}

        {showModal && (
            <div id="course-model" className="model-overlay">
                <div className="model-content">
                    <h3 style={{ textAlign: 'center' }}>{editCode ? `Update Course ${editCode}` : 'Add New Course'}</h3>
                    <form id="addCourseForm" onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label htmlFor="course-code">Course Code</label>
                            <input type="text" id="course-code" placeholder="Course Code (e.g., CS-101)" value={form['course-code']} onChange={handleChange} required />
                            <span className="error-msg" id="codeError">{errors.codeError || ''}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="course-name">Course Name</label>
                            <input type="text" id="course-name" placeholder="Course Name (e.g., Programming)" value={form['course-name']} onChange={handleChange} required />
                            <span className="error-msg" id="nameError">{errors.nameError || ''}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="credit-hours">Credit Hours</label>
                            <input type="number" id="credit-hours" placeholder="Credit Hours (1,2 or 3)" value={form['credit-hours']} onChange={handleChange} required />
                            <span className="error-msg" id="creditError">{errors.creditError || ''}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <select id="department" value={form.department} onChange={handleChange} required>
                                <option value="">Select Department</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Software Engineering">Software Engineering</option>
                                <option value="Data Science">Data Science</option>
                            </select>
                            <span className="error-msg" id="deptError">{errors.deptError || ''}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="instructor">Instructor</label>
                            <input type="text" id="instructor" placeholder="John Doe" value={form.instructor} onChange={handleChange} required />
                            <span className="error-msg" id="instructorError">{errors.instructorError || ''}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="semester">Semester</label>
                            <select id="semester" value={form.semester} onChange={handleChange} required>
                                <option value="">Select Semester</option>
                                <option value="1st">1st Semester</option>
                                <option value="2nd">2nd Semester</option>
                                <option value="3rd">3rd Semester</option>
                                <option value="4th">4th Semester</option>
                                <option value="5th">5th Semester</option>
                                <option value="6th">6th Semester</option>
                                <option value="7th">7th Semester</option>
                                <option value="8th">8th Semester</option>
                            </select>
                            <span className="error-msg" id="semesterError">{errors.semesterError || ''}</span>
                        </div>

                        <div className="form-actions">
                            <button type="submit" id="save-btn" className="add-btn-primary">
                                <i className="fa-solid fa-save"></i> {editCode ? 'Update Course Record' : 'Save Course Record'}
                            </button>
                            <button type="button" id="cancel-btn" className="add-btn-primary" onClick={() => { setShowModal(false); setErrors({}); navigate('/courses') }}>
                                <i className="fa-solid fa-cancel"></i> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </>
}

export default Courses;
