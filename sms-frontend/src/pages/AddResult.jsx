import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/common.css';
import '../css/addStudent.css';
import axios from 'axios';

function AddResult() {
    const navigate = useNavigate();
    const studentAPI = `${import.meta.env.VITE_API_URL}/api/students`;
    const courseAPI = `${import.meta.env.VITE_API_URL}/api/courses`;

    const token = localStorage.getItem('token');

    const [form, setForm] = useState({
        studentID: '', courseCode: '', marks: ''
    });

    const [errors, setErrors] = useState({});

    const [courseArray, setCourseArray] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchData = async () => {
            const courseRes = await axios.get(courseAPI, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCourseArray(courseRes.data);
        }

        fetchData();

    }, [])

    function handleChange(e) {
        setForm({ ...form, [e.target.id]: e.target.value });
    }

    async function handleSubmit(e) {
        setLoading(true);
        console.log('Submitting your result');
        e.preventDefault();

        const { studentID, courseCode, marks } = form;

        // CHECKING FOR ERRORS

        const newErrors = {};

        if (!studentID) newErrors.idError = 'ID is required';
        if (!courseCode) newErrors.courseError = 'Course Code is required';
        if (!marks) newErrors.marksError = 'Marks are required';

        const courseExists = courseArray.some(c => c.code === courseCode);

        if (!courseExists && courseCode) {
            newErrors.courseError = 'Course doesnot exists';
        }

        if (Number(marks) < 0 || Number(marks) > 100) {
            newErrors.marksError = 'Invalid marks. Marks must be between 0 and 100.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(`${courseAPI}/getGpaAndCredit`, { code: courseCode, marks: marks }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const { creditHours, gpa } = data;

            await axios.post(
                `${studentAPI}/${studentID}/results`,
                { courseCode, marks, creditHours, gpa }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );

            alert('Result added Successfully');

            setForm({
                studentID: '',
                courseCode: '',
                marks: ''
            });

            setErrors({});
        }
        catch (err) {
            console.log(err);

            if (err.response) {
                alert(err.response.data.message);
            } else {
                alert('Failed to add result');
            }
        } finally {
            setLoading(false);
        }
    }

    return <>

        <div className="form-card-wrapper">
            <form id="addResulttForm" onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="studentID">Student ID</label>
                        <input type="text" id="studentID" placeholder="e.g., 10200640" value={form.studentID} onChange={handleChange} required />
                        <span className="error-msg">{errors.idError || ''}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="courseCode">Course Code</label>
                        <input type="text" id="courseCode" placeholder="Course Code e.g, SMS-xx" value={form.courseCode} onChange={handleChange} required />
                        <span className="error-msg">{errors.courseError || ''}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="marks">Marks</label>
                        <input type="number" id="marks" placeholder="Enter Marks" value={form.marks} onChange={handleChange} required />
                        <span className="error-msg">{errors.marksError || ''}</span>
                    </div>

                </div>

                <div className="form-actions">
                    <center>
                        {
                            loading ? <button style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }} className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status">Authenticating...</span>
                            </button> : <button type="submit" className="add-btn-primary">
                                <i className="fa-solid fa-save"></i> Save Result
                            </button>
                        }
                    </center>
                </div>
            </form>
        </div>
    </>
}

export default AddResult;
