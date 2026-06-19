import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../css/auth.css';
import '../css/common.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
import { AuthContext } from '../store/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const authAPI = `${import.meta.env.VITE_API_URL}/api/auth`;

    const { token } = useContext(AuthContext);

    const [form, setForm] = useState({
        username: '', email: '', password: '', confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.id]: e.target.value })

        const newErrors = { ...errors };

        newErrors[e.target.id + 'Error'] = '';
        setErrors(newErrors);

    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const newErrors = {};

        const { username, password, email, confirmPassword } = form;

        // USERNAME VALIDATION
        if (!username) newErrors.usernameError = 'Username is required';

        // EMAIL VALIDATION
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.emailError = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.emailError = 'Invalid Email';
        }

        // PASSWORD VALIDATION
        if (!password) {
            newErrors.passwordError = 'Password is required';
        } else if (password.length < 10) {
            newErrors.passwordError = 'Password should be at least 10 characters long';
        } else if (!/[A-Z]/.test(password)) {
            newErrors.passwordError = 'Password must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(password)) {
            newErrors.passwordError = 'Password must contain at least one number';
        } else if (!/[a-z]/.test(password)) {
            newErrors.passwordError = 'Password must contain at least one lowercase letter';
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            newErrors.passwordError = 'Password must contain at least one special character';
        }

        // 4. Confirm Password validation
        if (!confirmPassword) {
            newErrors.confirmPasswordError = 'Confirmation is required';
        } else if (password !== confirmPassword) {
            newErrors.confirmPasswordError = 'Password and Confirm Password do not match. Please try again.';
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        const newUser = ({
            username,
            email,
            password,
        })

        // SAVE USER
        try {
            const response = await axios.post(authAPI, newUser);

            if (response.status === 201) {
                setErrors({});
                setLoading(false);
                alert("Account created! Check your email to verify your account. Check spam if you don't see it.");
                navigate('/login');
            }

        } catch (err) {
            setLoading(false);
            console.log(err);

            if (err.response?.status === 409) {
                const duplicatedField = err.response.data.field;
                duplicatedField === 'username' ? (
                    setErrors({ usernameError: 'Username Already Taken' }),
                    alert('Username Already Taken')
                ) : (
                    setErrors({ emailError: 'Email Already Registered' }),
                    alert('Email Already Registered')
                )
            }

            else if (err.response?.status === 403) {
                setErrors({
                    emailError: err.response.data.message
                });
            }

            else {
                alert('Server connection dropped. Please try again later.');
            }
        }


    }

    return <>
        <div className="auth-container">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p>Join the Student Management System</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        id='username'
                        value={form.username}
                        onChange={handleChange}
                    />

                    {errors.usernameError ? <span className='error-msg' id='nameError'>{errors.usernameError}</span> : ''}

                    <input
                        type="email"
                        placeholder="Email"
                        id='email'
                        value={form.email}
                        onChange={handleChange}
                    />

                    {errors.emailError ? <span className='error-msg' id='emailError'>{errors.emailError}</span> : ''}

                    <div className='password-input-wrapper'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            id='password'
                            value={form.password}
                            onChange={handleChange}
                        />

                        <span onClick={() => setShowPassword(!showPassword)}>
                            <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                        </span>
                    </div>

                    {errors.passwordError ? <span className='error-msg' id='passwordError'>{errors.passwordError}</span> : ''}

                    <div className='password-input-wrapper'>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            id='confirmPassword'
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />

                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <i className={showConfirmPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                        </span>
                    </div>

                    {errors.confirmPasswordError ? <span className='error-msg' id='confirmPasswordError'>{errors.confirmPasswordError}</span> : ''}

                    {
                        loading ? <button style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }} className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            <span role="status">Creating Account...</span>
                        </button> : <button type="submit">
                            Create Account
                        </button>
                    }

                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    </>
}

export default Signup;