
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-selector" style={{ marginBottom: '1rem' }}>
            <label htmlFor="language-select" style={{ marginRight: '0.5rem' }}>{t('common.language')}:</label>
            <select
                id="language-select"
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language.split('-')[0]} // Handle 'es-ES' or 'en-US'
                style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #ccc'
                }}
            >
                <option value="es">Español</option>
                <option value="en">English</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
