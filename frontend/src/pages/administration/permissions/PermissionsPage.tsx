
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, ChevronRight, Lock, Unlock, Plus, Edit, Trash2 } from 'lucide-react';
import api from '@/api/axios';
import { useToast } from '@/context/ToastContext';
import PermissionModal from './PermissionModal';

interface Permission {
    id: string;
    name: string;
    description: string;
    is_private: boolean;
    module_id: string;
    module_name?: string;
}

interface Module {
    id: string;
    description: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const PermissionsPage: React.FC = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

    const fetchModules = useCallback(async () => {
        try {
            const response = await api.get('/permissions/modules');
            setModules(response.data);
        } catch (error) {
            console.error(error);
            addToast(t('common.error_fetching_modules', 'Error loading modules'), 'error');
        }
    }, [addToast, t]);

    const fetchPermissions = useCallback(async (searchTerm: string, pageNum: number) => {
        setLoading(true);
        try {
            const response = await api.get('/permissions', {
                params: {
                    search: searchTerm,
                    page: pageNum,
                    limit: 10
                }
            });
            setPermissions(response.data.data);
            setPagination(response.data.meta);
        } catch (error) {
            console.error(error);
            addToast(t('common.unexpected_error'), 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast, t]);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPermissions(search, page);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, page, fetchPermissions]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleCreate = () => {
        setSelectedPermission(null);
        setModalOpen(true);
    };

    const handleEdit = (permission: Permission) => {
        setSelectedPermission(permission);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(t('common.confirm_delete', 'Are you sure you want to delete this item?'))) return;

        try {
            await api.delete(`/permissions/${id}`);
            addToast(t('common.deleted_successfully', 'Deleted successfully'), 'success');
            fetchPermissions(search, page);
        } catch (error) {
            console.error(error);
            addToast(t('common.error_deleting', 'Error deleting item'), 'error');
        }
    };

    const handleSave = async (data: any) => {
        try {
            if (selectedPermission) {
                await api.put(`/permissions/${selectedPermission.id}`, data);
                addToast(t('common.updated_successfully', 'Updated successfully'), 'success');
            } else {
                await api.post('/permissions', data);
                addToast(t('common.created_successfully', 'Created successfully'), 'success');
            }
            fetchPermissions(search, page);
        } catch (error) {
            console.error(error);
            addToast(t('common.error_saving', 'Error saving item'), 'error');
            throw error; // Re-throw to be caught in modal
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">
                    {t('permissions.title')}
                </h2>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="search-container">
                        <Search
                            size={20}
                            className="search-icon"
                        />
                        <input
                            type="text"
                            placeholder={t('permissions.search_placeholder')}
                            value={search}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="btn btn-primary"
                    >
                        <Plus size={20} />
                        {t('permissions.add_new', 'Add New')}
                    </button>
                </div>
            </div>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>{t('permissions.module')}</th>
                            <th>{t('permissions.name')}</th>
                            <th>{t('permissions.description')}</th>
                            <th>{t('permissions.is_private')}</th>
                            <th style={{ textAlign: 'right' }}>{t('common.actions', 'Actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                    {t('common.loading')}
                                </td>
                            </tr>
                        ) : permissions.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                    {t('common.no_results')}
                                </td>
                            </tr>
                        ) : (
                            permissions.map((permission) => (
                                <tr key={permission.id}>
                                    <td>
                                        <span className="badge badge-info" style={{ color: '#4338ca', backgroundColor: '#eef2ff' }}>
                                            {permission.module_name || 'System'}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>
                                        {permission.name}
                                    </td>
                                    <td style={{ color: '#6b7280' }}>
                                        {permission.description}
                                    </td>
                                    <td>
                                        {permission.is_private ? (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', color: '#dc2626' }}>
                                                <Lock size={16} style={{ marginRight: '4px' }} />
                                                {t('common.yes')}
                                            </span>
                                        ) : (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', color: '#059669' }}>
                                                <Unlock size={16} style={{ marginRight: '4px' }} />
                                                {t('common.no')}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleEdit(permission)}
                                            className="btn-icon"
                                            title={t('common.edit', 'Edit')}
                                            style={{ color: '#2563eb' }}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(permission.id)}
                                            className="btn-icon"
                                            title={t('common.delete', 'Delete')}
                                            style={{ color: '#dc2626' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {pagination && pagination.totalPages > 1 && (
                    <div className="pagination-container">
                        <span className="pagination-text">
                            {t('common.page_of', { page: pagination.page, total: pagination.totalPages })}
                        </span>
                        <div className="pagination-controls">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                                className="pagination-btn"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= pagination.totalPages}
                                className="pagination-btn"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <PermissionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                permission={selectedPermission}
                modules={modules}
            />
        </div>
    );
};

export default PermissionsPage;
