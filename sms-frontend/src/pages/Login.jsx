import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

import '../css/auth.css';
import '../css/common.css';

const Login = () => {
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();
    const authAPI = `${import.meta.env.VITE_API_URL}/api/auth`;

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.id]: e.target.value });

        setErrors(prev => ({
            ...prev,
            [e.target.id + 'Error']: ''
        }));

    }

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);

        const newErrors = {};
        const { email, password } = form;

        if (!email) {
            newErrors.emailError = 'Email is required';
        }

        if (!password) {
            newErrors.passwordError = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${authAPI}/login`, {
                email,
                password
            });

            if (response.status === 200) {
                alert("Login successful!");

                const token = response.data.token;

                login(token);
                navigate('/');
            }

        } catch (err) {
            console.log(err);

            if (err.response?.status === 401) {
                setErrors({ emailError: 'Invalid email or password' });
            }

            else if (err.response?.status === 403) {
                setErrors({ emailError: 'Please Verify Your Email First' });
            }

            else {
                alert('Server error. Try again later.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='auth-overall-container'>
            <div className="login-auth-container">
                <div className="auth-card">
                    <h1>Login</h1>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            id='email'
                            value={form.email}
                            onChange={handleChange}
                        />

                        {errors.emailError && (
                            <span className='error-msg'>{errors.emailError}</span>
                        )}

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

                        {errors.passwordError && (
                            <span className='error-msg'>{errors.passwordError}</span>
                        )}

                        {
                            loading ? <button style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }} className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status">Authenticating...</span>
                            </button> : <button type="submit">
                                Login
                            </button>
                        }

                    </form>

                    <div className="auth-footer">
                        Don't have an account?{' '}
                        <Link to="/signup">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;