
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
        <div className="not-found-container">
            <img
                src={notFoundImage}
                alt="404 Not Found"
                className="not-found-image"
            />
            <h2>{t('errors.404_title')}</h2>
            <p className="not-found-message">
                {t('errors.404_message')}
            </p>
            <button
                onClick={handleGoBack}
                className="btn btn-primary"
                style={{ minWidth: '150px' }}
            >
                {t('errors.back_home')}
            </button>
        </div>
    );
};

export default NotFoundPage;
