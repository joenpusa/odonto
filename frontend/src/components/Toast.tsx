
import React from 'react';

interface ToastProps {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    return (
        <div className={`toast toast-${type}`}>
            <span className="toast-icon">{icons[type]}</span>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={onClose}>&times;</button>
        </div>
    );
};

export default Toast;
