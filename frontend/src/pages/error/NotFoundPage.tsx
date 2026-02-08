
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import notFoundImage from '@/assets/404imagen.png';

const NotFoundPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleGoBack = () => {
        if (isAuthenticated) {
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <img
                src={notFoundImage}
                alt="404 Not Found"
                style={{ maxWidth: '100%', maxHeight: '400px', marginBottom: '2rem' }}
            />
            <h2>{t('errors.404_title')}</h2>
            <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                {t('errors.404_message')}
            </p>
            <button
                onClick={handleGoBack}
                className="btn-primary"
                style={{ maxWidth: '200px' }}
            >
                {t('errors.back_home')}
            </button>
        </div>
    );
};

export default NotFoundPage;
