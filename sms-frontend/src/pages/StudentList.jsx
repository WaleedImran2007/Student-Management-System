import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import '../css/common.css';
import '../css/studentList.css';
import Loader from '../components/Loader';

function StudentList() {
    const token = localStorage.getItem('token');
    const [ loading, setLoading ] = useState(true);

    let userRole = null;
    if (token) {
        const decoded = jwtDecode(token);
        userRole = decoded.role;
    }

    const navigate = useNavigate();
    const API = `${import.meta.env.VITE_API_URL}/api/students`;

    const [studentArray, setStudentArray] = useState([]);

    // GET ALL STUDENTS
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(API, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setStudentArray(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        fetchStudents();

    }, [])

    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] = useState('');


    async function deleteStudent(id) {
        try {
            await axios.delete(`${API}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updated = studentArray.filter(student => student.id !== id);

            setStudentArray(updated);

            alert(`Student with ID ${id} deleted Successfully!`);
        } catch (err) {
            console.log(err);
        }
    }

    function editStudent(id) {
        navigate(`/add-student?id=${id}`);
    }

    let displayed = [...studentArray];

    // FILTERING METHOD

    if (filterText.trim()) {
        const q = filterText.trim().toLowerCase();

        displayed = displayed.filter((student) => {
            return (
                student.name.toLowerCase().includes(q) ||
                student.department.toLowerCase().includes(q) ||
                student.id.toString().includes(q)
            );
        });
    }

    // SORTING METHOD

    if (sortBy === 'id') displayed.sort((a, b) => a.id - b.id);
    if (sortBy === 'age') displayed.sort((a, b) => a.age - b.age);
    if (sortBy === 'name') displayed.sort((a, b) => a.name.localeCompare(b.name));


    if(loading) return <Loader />

    return <>
        <div className="list-header-row">
            <div className="student-list-heading">STUDENT RECORDS</div>
            <Link to="/add-student" className="add-btn-primary">
                <i className="fa-solid fa-plus"></i> Add New Student
            </Link>
        </div>

        <div className="table-card-wrapper">
            <div className="table-controls">
                <div className="search-box-container">
                    <input
                        type="text"
                        id="tableFilterInput"
                        placeholder="Search by name, ID, or department..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                </div>

                <div className="sort-container">
                    <label htmlFor="sortSelect">Sort By:</label>

                    <select id="sortSelect"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="id">Student ID</option>
                        <option value="age">Age</option>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="student-table-body">
                        {displayed.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: '#64748B', padding: '30px' }}>
                                    No student records found. Click "Add New Student" to begin.
                                </td>
                            </tr>
                        ) : (
                            displayed.map(student => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.age}</td>
                                    <td>{student.email}</td>
                                    <td>{student.department}</td>
                                    <td>
                                        <div className="action-btn-group">
                                            {
                                                userRole !== 'Student' && <Link to={`/studentProfile?id=${student.id}`} className="action-btn btn-view">
                                                    <i className="fa-solid fa-eye"></i>
                                                </Link>
                                            }


                                            {
                                                userRole === 'Admin' && (<>
                                                    <button
                                                        onClick={() => deleteStudent(student.id)}
                                                        className="action-btn btn-delete">
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>

                                                    <button
                                                        onClick={() => editStudent(student.id)}
                                                        className="action-btn btn-edit">
                                                        <i className="fa-solid fa-edit"></i>
                                                    </button>
                                                </>)
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
}

export default StudentList;
