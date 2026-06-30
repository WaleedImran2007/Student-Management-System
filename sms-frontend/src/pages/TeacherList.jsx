import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { jwtDecode } from 'jwt-decode';

import '../css/common.css';
import '../css/studentList.css';
import Loader from '../components/Loader';

function TeacherList() {
    const navigate = useNavigate();

    const [teacherArray, setTeacherArray] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    let userRole = null;

    if (token) {
        const decoded = jwtDecode(token);
        userRole = decoded.role;
    }

    // GET ALL TEACHERS
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await api.get('/teachers');

                setTeacherArray(res.data);

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();

    }, []);

    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] = useState('');

    async function deleteTeacher(id) {
        try {
            await api.delete(`/teachers/${id}`);

            const updated = teacherArray.filter(
                teacher => teacher.id !== id
            );

            setTeacherArray(updated);

            alert(`Teacher with ID ${id} deleted Successfully!`);

        } catch (err) {
            console.log(err);
        }
    }

    function editTeacher(id) {
        navigate(`/add-teacher?id=${id}`);
    }

    let displayed = [...teacherArray];

    // FILTERING

    if (filterText.trim()) {
        const q = filterText.trim().toLowerCase();

        displayed = displayed.filter((teacher) => {
            return (
                teacher.name.toLowerCase().includes(q) ||
                teacher.department.toLowerCase().includes(q) ||
                teacher.id.toString().includes(q)
            );
        });
    }

    // SORTING

    if (sortBy === 'id') {
        displayed.sort((a, b) => a.id.localeCompare(b.id));
    }

    if (sortBy === 'age') {
        displayed.sort((a, b) => a.age - b.age);
    }

    if (sortBy === 'name') {
        displayed.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    if(loading) return <Loader />

    return (
        <>
            <div className="list-header-row">
                <div className="student-list-heading">
                    TEACHER RECORDS
                </div>

                {
                    userRole === 'Admin' && <Link
                        to="/add-teacher"
                        className="add-btn-primary"
                    >
                        <i className="fa-solid fa-plus"></i>
                        {' '}Add New Teacher
                    </Link>
                }

            </div>

            <div className="table-card-wrapper">
                <div className="table-controls">

                    <div className="search-box-container">
                        <input
                            type="text"
                            placeholder="Search by name, ID, or department..."
                            value={filterText}
                            onChange={e =>
                                setFilterText(e.target.value)
                            }
                        />
                    </div>

                    <div className="sort-container">
                        <label htmlFor="sortSelect">
                            Sort By:
                        </label>

                        <select
                            id="sortSelect"
                            value={sortBy}
                            onChange={e =>
                                setSortBy(e.target.value)
                            }
                        >
                            <option value="">
                                Sort By
                            </option>

                            <option value="name">
                                Name (A-Z)
                            </option>

                            <option value="id">
                                Teacher ID
                            </option>

                            <option value="age">
                                Age
                            </option>
                        </select>
                    </div>

                </div>

                <div className="table-responsive">
                    <table className="students-master-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {displayed.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            textAlign: 'center',
                                            color: '#64748B',
                                            padding: '30px'
                                        }}
                                    >
                                        No teacher records found.
                                        Click "Add New Teacher"
                                        to begin.
                                    </td>
                                </tr>
                            ) : (
                                displayed.map(teacher => (
                                    <tr key={teacher.id}>
                                        <td>{teacher.id}</td>
                                        <td>{teacher.name}</td>
                                        <td>{teacher.age}</td>
                                        <td>{teacher.email}</td>
                                        <td>{teacher.department}</td>
                                        <td>{teacher.designation}</td>

                                        <td>
                                            <div className="action-btn-group">

                                                <Link
                                                    to={`/teacherProfile?id=${teacher.id}`}
                                                    className="action-btn btn-view"
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                </Link>

                                                {
                                                    userRole === 'Admin' && <button
                                                        onClick={() =>
                                                            deleteTeacher(teacher.id)
                                                        }
                                                        className="action-btn btn-delete"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                }

                                                {
                                                    userRole === 'Admin' && <button
                                                        onClick={() =>
                                                            editTeacher(teacher.id)
                                                        }
                                                        className="action-btn btn-edit"
                                                    >
                                                        <i className="fa-solid fa-edit"></i>
                                                    </button>
                                                }

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </>
    );
}

export default TeacherList;