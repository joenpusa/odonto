
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-selector" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Globe size={20} style={{ color: '#6b7280', position: 'absolute', left: '8px', zIndex: 1, pointerEvents: 'none' }} />
            <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language && i18n.language.split ? i18n.language.split('-')[0] : 'es'}
                style={{
                    padding: '8px 8px 8px 32px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    appearance: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#374151',
                    outline: 'none'
                }}
            >
                <option value="es">ES</option>
                <option value="en">EN</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
