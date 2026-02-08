import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../index.css';

const loginSchema = z.object({
    tax_id: z.string().min(1, 'Company ID is required'),
    username: z.string().min(1, 'Username is required'), // Changed from email to string
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        try {
            const response = await api.post('/auth/login', data);
            const { accessToken, refreshToken, user } = response.data;
            login(accessToken, refreshToken, user);
            navigate('/');
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="subtitle">Sign in to your account</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="tax_id">Company ID</label>
                        <input
                            id="tax_id"
                            type="text"
                            placeholder="Enter company ID"
                            {...register('tax_id')}
                            className={errors.tax_id ? 'input-error' : ''}
                        />
                        {errors.tax_id && <span className="error-text">{errors.tax_id.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            {...register('username')}
                            className={errors.username ? 'input-error' : ''}
                        />
                        {errors.username && <span className="error-text">{errors.username.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <span className="error-text">{errors.password.message}</span>}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
