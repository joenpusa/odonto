import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import LanguageSelector from '@/components/LanguageSelector';
import '@/index.css';

const loginSchemaShape = z.object({
    tax_id: z.string(),
    username: z.string(),
    password: z.string(),
});

type LoginFormData = z.infer<typeof loginSchemaShape>;

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addToast } = useToast();

    const loginSchema = z.object({
        tax_id: z.string().min(1, t('auth.company_id_required')),
        username: z.string().min(1, t('auth.username_required')),
        password: z.string().min(1, t('auth.password_required')),
    });

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
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <LanguageSelector />
                </div>
                <h2>{t('auth.sign_in')}</h2>

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
