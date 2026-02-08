
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            <Navbar toggleSidebar={toggleSidebar} />

            <Sidebar isOpen={sidebarOpen} />

            <main style={{
                marginLeft: sidebarOpen ? '250px' : '0',
                transition: 'margin-left 0.3s ease-in-out',
                padding: '24px',
                minHeight: 'calc(100vh - 64px)'
            }}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
