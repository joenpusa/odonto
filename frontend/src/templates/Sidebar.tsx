
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Settings, Building2, ChevronDown, ChevronRight, Lock, Table, Users } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    const { t } = useTranslation();
    const [adminOpen, setAdminOpen] = useState(false);
    const [tablesOpen, setTablesOpen] = useState(false);

    const sidebarStyle: React.CSSProperties = {
        width: '250px',
        height: 'calc(100vh - 64px)', // Full height minus navbar
        backgroundColor: '#fff',
        borderRight: '1px solid #e5e7eb',
        position: 'fixed',
        top: '64px',
        left: isOpen ? '0' : '-250px',
        transition: 'left 0.3s ease-in-out',
        overflowY: 'auto',
        zIndex: 9
    };

    const linkStyle = ({ isActive }: { isActive: boolean }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '12px 20px',
        textDecoration: 'none',
        color: isActive ? '#2563eb' : '#374151',
        backgroundColor: isActive ? '#eff6ff' : 'transparent',
        borderRight: isActive ? '3px solid #2563eb' : '3px solid transparent',
        fontWeight: isActive ? 600 : 400
    });

    const submenuStyle = {
        paddingLeft: '40px',
        backgroundColor: '#f9fafb'
    };

    return (
        <aside style={sidebarStyle}>
            <nav style={{ padding: '16px 0' }}>
                <NavLink to="/" style={linkStyle} end>
                    <LayoutDashboard size={20} style={{ marginRight: '12px' }} />
                    {t('menu.dashboard')}
                </NavLink>

                {/* Admin Submenu */}
                <div>
                    <button
                        onClick={() => setAdminOpen(!adminOpen)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 20px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#374151',
                            fontSize: '1rem',
                            fontFamily: 'inherit'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Settings size={20} style={{ marginRight: '12px' }} />
                            <span>{t('menu.administration')}</span>
                        </div>
                        {adminOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {adminOpen && (
                        <div style={submenuStyle}>
                            <NavLink to="/companies" style={linkStyle}>
                                <Building2 size={18} style={{ marginRight: '12px' }} />
                                {t('menu.companies')}
                            </NavLink>
                            <NavLink to="/permissions" style={linkStyle}>
                                <Lock size={18} style={{ marginRight: '12px' }} />
                                {t('permissions.title')}
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Tablas Submenu (Top Level) */}
                <div>
                    <button
                        onClick={() => setTablesOpen(!tablesOpen)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 20px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#374151',
                            fontSize: '1rem',
                            fontFamily: 'inherit'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Table size={20} style={{ marginRight: '12px' }} />
                            <span>{t('menu.tables')}</span>
                        </div>
                        {tablesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {tablesOpen && (
                        <div style={submenuStyle}>
                            <NavLink to="/tables/people" style={linkStyle}>
                                <Users size={18} style={{ marginRight: '12px' }} />
                                <span>{t('people.title')}</span>
                            </NavLink>
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
