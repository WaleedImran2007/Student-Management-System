import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import '../css/common.css';
import '../css/addStudent.css';
import axios from 'axios';

function AddStudent() {
    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(false);

    let userRole = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded.role;
        }

        catch (err) {
            console.error("Invalid token format");
        }
    }

    const navigate = useNavigate();
    const API = `${import.meta.env.VITE_API_URL}/api/students`;

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const editID = query.get("id");

    const [form, setForm] = useState({
        studentID: '', fullName: '', email: '', phone: '',
        age: '', gender: '', department: '', semester: ''
    });

    const [errors, setErrors] = useState({});

    // FETCH STUDENT BY ID
    useEffect(() => {
        const fetchStudent = async () => {
            if (!editID) return;

            try {
                const res = await axios.get(`${API}/${editID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const student = res.data;

                if (student) {
                    setForm({
                        studentID: student.id,
                        fullName: student.name,
                        email: student.email,
                        phone: student.phone,
                        age: student.age,
                        gender: student.gender,
                        department: student.department,
                        semester: student.semester
                    })
                }

            } catch (err) {
                console.log(err);
            }
        }

        fetchStudent();

    }, [editID])


    function handleChange(e) {
        setForm({ ...form, [e.target.id]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const { studentID, fullName, email, phone, age, gender, department, semester } = form;

        const newErrors = {};

        if (!studentID) newErrors.idError = 'ID is required';
        if (!fullName) newErrors.nameError = 'Name is required';
        if (!phone) newErrors.phoneError = 'Phone is required';
        if (!gender) newErrors.genderError = 'Select a gender';
        if (!department) newErrors.deptError = 'Select a department';
        if (!semester) newErrors.semesterError = 'Select a semester';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.emailError = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.emailError = 'Invalid Email';
        }

        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 16 || ageNum > 80) {
            newErrors.ageError = 'Please enter a valid academic age (16-80)';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const newStudent = {
            id: studentID,
            name: fullName,
            email,
            phone,
            age: ageNum,
            gender,
            department,
            semester
        };


        try {
            setLoading(true);

            if (editID) {
                await axios.put(`${API}/${editID}`, newStudent, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                alert('Student updated successfully!');
            }

            else {
                await axios.post(API, newStudent, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                alert('Student added successfully!');
            }

            navigate('/student-list');

        } catch (err) {
            if(err.response?.status === 409) {
                const duplicatedField = err.response.data.field;
                duplicatedField === 'id' ? (
                    setErrors({idError: 'ID Already Registered'}),
                    alert('ID Already Registered')
                ) : (
                    setErrors({emailError: 'Email Already Registered'}),
                    alert('Email Already Registered')
                )
            }

            else {
                alert('Something Went Wrong');
                console.log(err);
            }
            
        } finally {
            setLoading(false);
        }
    }

    return <>
        <div className="form-card-wrapper">
            <form id="addStudentForm" onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="studentID">Student ID</label>
                        <input type="text" id="studentID" placeholder="e.g., 10200640" value={form.studentID} onChange={handleChange} required />
                        <span className="error-msg" id="idError">{errors.idError || ''}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullName">Name</label>
                        <input type="text" id="fullName" placeholder="John Doe" value={form.fullName} onChange={handleChange} required />
                        <span className="error-msg">{errors.nameError || ''}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" placeholder="johndoe@example.com" value={form.email} onChange={handleChange} required />
                        <span className="error-msg" id="emailError">{errors.emailError || ''}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" placeholder="123-456-7890" value={form.phone} onChange={handleChange} required />
                        <span className="error-msg" id="phoneError">{errors.phoneError || ''}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input type="number" id="age" placeholder="e.g., 20" value={form.age} onChange={handleChange} required />
                        <span className="error-msg" id="ageError">{errors.ageError || ''}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select id="gender" value={form.gender} onChange={handleChange} required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <span className="error-msg" id="genderError">{errors.genderError || ''}</span>
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
                </div>

                <div className="form-actions">
                    <center>
                        {
                            loading ? <button style={{display: 'flex', gap: '10px'}} className="btn btn-primary" type="button" disabled>
                                <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status">Saving Your Data...</span>
                            </button> : <button type="submit" className="add-btn-primary">
                                <i className="fa-solid fa-save"></i> {editID ? 'Update Student Record' : 'Save Student Record'}
                            </button>
                        }

                    </center>
                </div>
            </form>
        </div>

    </>
}

export default AddStudent;
