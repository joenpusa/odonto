import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import LanguageSelector from '@/components/LanguageSelector';
import { createLoginSchema } from '@/validators/auth.validator';
import type { LoginFormData } from '@/validators/auth.validator';
import '@/index.css';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addToast } = useToast();

    const loginSchema = createLoginSchema(t);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await api.post('/auth/login', data);
            const { accessToken, refreshToken, user } = response.data;
            login(accessToken, refreshToken, user);
            addToast(t('auth.login_successful') || 'Login successful', 'success');
            navigate('/');
        } catch (err: any) {
            let errorMessage = t('common.unexpected_error');
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }
            addToast(errorMessage, 'error');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <LanguageSelector />
                </div>
                <h2>{t('auth.sign_in')}</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="tax_id" className="form-label">{t('auth.company_id')}</label>
                        <input
                            id="tax_id"
                            type="text"
                            placeholder={t('auth.company_id')}
                            {...register('tax_id')}
                            className={`form-input ${errors.tax_id ? 'input-error' : ''}`}
                        />
                        {errors.tax_id && <span className="error-text">{errors.tax_id.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="username" className="form-label">{t('auth.username')}</label>
                        <input
                            id="username"
                            type="text"
                            placeholder={t('auth.username')}
                            {...register('username')}
                            className={`form-input ${errors.username ? 'input-error' : ''}`}
                        />
                        {errors.username && <span className="error-text">{errors.username.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">{t('auth.password')}</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                            className={`form-input ${errors.password ? 'input-error' : ''}`}
                        />
                        {errors.password && <span className="error-text">{errors.password.message}</span>}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full" style={{ marginTop: '1rem' }}>
                        {isSubmitting ? t('common.loading') : t('auth.sign_in')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
