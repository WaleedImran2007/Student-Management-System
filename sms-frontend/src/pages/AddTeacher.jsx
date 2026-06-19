import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import '../css/common.css';
import '../css/addStudent.css';

function AddTeacher() {
    const navigate = useNavigate();
    const API = `${import.meta.env.VITE_API_URL}/api/teachers`;

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const editID = query.get('id');

    const token = localStorage.getItem('token');

    const [form, setForm] = useState({
        teacherID: '',
        fullName: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        department: '',
        designation: '',
        experience: '',
    });

    const [errors, setErrors] = useState({});

    // FETCH TEACHER BY ID
    useEffect(() => {
        const fetchTeacher = async () => {
            if (!editID) return;

            try {
                const res = await axios.get(`${API}/${editID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const teacher = res.data;

                if (teacher) {
                    setForm({
                        teacherID: teacher.id,
                        fullName: teacher.name,
                        email: teacher.email,
                        phone: teacher.phone,
                        age: teacher.age,
                        gender: teacher.gender,
                        department: teacher.department,
                        designation: teacher.designation,
                        experience: teacher.experience,
                    });
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchTeacher();
    }, [editID]);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const {
            teacherID,
            fullName,
            email,
            phone,
            age,
            gender,
            department,
            designation,
            experience,
        } = form;

        const newErrors = {};

        if (!teacherID) newErrors.idError = 'ID is required';
        if (!fullName) newErrors.nameError = 'Name is required';
        if (!phone) newErrors.phoneError = 'Phone is required';
        if (!gender) newErrors.genderError = 'Select a gender';
        if (!department) newErrors.deptError = 'Select a department';
        if (!designation) newErrors.designationError = 'Select a designation';
        if(!experience) newErrors.experienceError = 'Experience is Required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            newErrors.emailError = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.emailError = 'Invalid Email';
        }

        const ageNum = parseInt(age);

        if (isNaN(ageNum) || ageNum < 20 || ageNum > 80) {
            newErrors.ageError =
                'Please enter a valid age between 20 and 80';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const newTeacher = {
            id: teacherID,
            name: fullName,
            email,
            phone,
            age: ageNum,
            gender,
            department,
            designation,
            experience
        };

        try {
            if (editID) {
                await axios.put(`${API}/${editID}`, newTeacher, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                alert('Teacher updated successfully!');
            } else {
                await axios.post(API, newTeacher, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                alert('Teacher added successfully!');
            }

            navigate('/teacher-list');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="form-card-wrapper">
            <form id="addTeacherForm" onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="teacherID">Teacher ID</label>
                        <input
                            type="text"
                            id="teacherID"
                            placeholder="e.g., T001"
                            value={form.teacherID}
                            onChange={handleChange}
                        />
                        <span className="error-msg">
                            {errors.idError || ''}
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullName">Name</label>
                        <input
                            type="text"
                            id="fullName"
                            placeholder="John Doe"
                            value={form.fullName}
                            onChange={handleChange}
                        />
                        <span className="error-msg">
                            {errors.nameError || ''}
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="teacher@example.com"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <span className="error-msg">
                            {errors.emailError || ''}
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="123-456-7890"
                            value={form.phone}
                            onChange={handleChange}
                        />
                        <span className="error-msg">
                            {errors.phoneError || ''}
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input
                            type="number"
                            id="age"
                            placeholder="e.g., 35"
                            value={form.age}
                            onChange={handleChange}
                        />
                        <span className="error-msg">
                            {errors.ageError || ''}
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            value={form.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        <span className="error-msg">
                            {errors.genderError || ''}
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <select
                            id="department"
                            value={form.department}
                            onChange={handleChange}
                        >
                            <option value="">Select Department</option>
                            <option value="Computer Science">
                                Computer Science
                            </option>
                            <option value="Software Engineering">
                                Software Engineering
                            </option>
                            <option value="Data Science">
                                Data Science
                            </option>
                        </select>

                        <span className="error-msg">
                            {errors.deptError || ''}
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="designation">Designation</label>
                        <select
                            id="designation"
                            value={form.designation}
                            onChange={handleChange}
                        >
                            <option value="">Select Designation</option>
                            <option value="Lecturer">Lecturer</option>
                            <option value="Assistant Professor">
                                Assistant Professor
                            </option>
                            <option value="Associate Professor">
                                Associate Professor
                            </option>
                            <option value="Professor">Professor</option>
                        </select>

                        <span className="error-msg">
                            {errors.designationError || ''}
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="experience">Experience</label>
                        <textarea
                            type="text"
                            id="experience"
                            placeholder="Enter Experience Here"
                            value={form.experience}
                            onChange={handleChange}
                        />
                        <span className="error-msg">
                            {errors.experienceError || ''}
                        </span>
                    </div>

                </div>

                <div className="form-actions">
                    <center>
                        <button
                            type="submit"
                            className="add-btn-primary"
                        >
                            <i className="fa-solid fa-save"></i>{' '}
                            {editID
                                ? 'Update Teacher Record'
                                : 'Save Teacher Record'}
                        </button>
                    </center>
                </div>
            </form>
        </div>
    );
}

export default AddTeacher;