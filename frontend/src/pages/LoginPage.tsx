import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import LanguageSelector from '@/components/LanguageSelector';
import '@/index.css';

const loginSchema = z.object({
    tax_id: z.string().min(1, 'Company ID is required'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation(); // Use default namespace 'translation'
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
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <LanguageSelector />
                </div>
                <h2>{t('auth.sign_in')}</h2> {/* "Sign In" / "Iniciar Sesión" */}
                {/* <p className="subtitle">Sign in to your account</p>  Let's keep this simple or add to i18n later */}

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="tax_id">{t('auth.company_id')}</label>
                        <input
                            id="tax_id"
                            type="text"
                            placeholder={t('auth.company_id')}
                            {...register('tax_id')}
                            className={errors.tax_id ? 'input-error' : ''}
                        />
                        {errors.tax_id && <span className="error-text">{errors.tax_id.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">{t('auth.username')}</label>
                        <input
                            id="username"
                            type="text"
                            placeholder={t('auth.username')}
                            {...register('username')}
                            className={errors.username ? 'input-error' : ''}
                        />
                        {errors.username && <span className="error-text">{errors.username.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">{t('auth.password')}</label>
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
                        {isSubmitting ? '...' : t('auth.sign_in')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
