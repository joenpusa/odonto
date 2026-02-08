
import React from 'react';
import { Menu } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const { logout } = useAuth();
    const { t } = useTranslation();

    return (
        <nav style={{
            height: '64px',
            backgroundColor: '#fff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '16px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Menu size={24} />
                </button>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Dental App</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <LanguageSelector />
                <button
                    onClick={logout}
                    className="btn-primary" // Reusing existing class, might want a variant later
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                    {t('common.logout')}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
