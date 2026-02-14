import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import api from '@/api/axios';
import { useToast } from '@/context/ToastContext';
import FormPeople from './FormPeople';

interface Person {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    document_type: string;
    document_number: string;
    address: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const PersonasPage: React.FC = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    const fetchPeople = useCallback(async (searchTerm: string, pageNum: number) => {
        setLoading(true);
        try {
            const response = await api.get('/people', {
                params: {
                    search: searchTerm,
                    page: pageNum,
                    limit: 10
                }
            });
            setPeople(response.data.data);
            setPagination(response.data.meta);
        } catch (error) {
            console.error(error);
            addToast(t('common.unexpected_error'), 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast, t]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPeople(search, page);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, page, fetchPeople]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleCreate = () => {
        setSelectedPerson(null);
        setModalOpen(true);
    };

    const handleEdit = (person: Person) => {
        setSelectedPerson(person);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(t('common.confirm_delete', 'Are you sure you want to delete this item?'))) return;

        try {
            await api.delete(`/people/${id}`);
            addToast(t('common.deleted_successfully', 'Deleted successfully'), 'success');
            fetchPeople(search, page);
        } catch (error) {
            console.error(error);
            addToast(t('common.error_deleting', 'Error deleting item'), 'error');
        }
    };

    const handleSave = async (data: any) => {
        try {
            if (selectedPerson) {
                await api.put(`/people/${selectedPerson.id}`, data);
                addToast(t('common.updated_successfully', 'Updated successfully'), 'success');
            } else {
                await api.post('/people', data);
                addToast(t('common.created_successfully', 'Created successfully'), 'success');
            }
            fetchPeople(search, page);
        } catch (error) {
            console.error(error);
            addToast(t('common.error_saving', 'Error saving item'), 'error');
            throw error;
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">
                    {t('people.title')}
                </h2>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="search-container">
                        <Search
                            size={20}
                            className="search-icon"
                        />
                        <input
                            type="text"
                            placeholder={t('people.search_placeholder')}
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
                        {t('people.add_new', 'Add New')}
                    </button>
                </div>
            </div>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>{t('people.name')}</th>
                            <th>{t('people.dni')}</th>
                            <th>{t('people.email')}</th>
                            <th>{t('people.phone')}</th>
                            <th style={{ textAlign: 'right' }}>{t('people.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                    {t('common.loading')}
                                </td>
                            </tr>
                        ) : people.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                    {t('people.no_results')}
                                </td>
                            </tr>
                        ) : (
                            people.map((person) => (
                                <tr key={person.id}>
                                    <td style={{ fontWeight: 500 }}>
                                        {person.first_name} {person.last_name}
                                    </td>
                                    <td style={{ color: '#4b5563' }}>
                                        {person.document_number || '-'}
                                    </td>
                                    <td style={{ color: '#4b5563' }}>
                                        {person.email || '-'}
                                    </td>
                                    <td style={{ color: '#4b5563' }}>
                                        {person.phone || '-'}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleEdit(person)}
                                            className="btn-icon"
                                            title={t('common.edit', 'Edit')}
                                            style={{ color: '#2563eb' }}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(person.id)}
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

            <FormPeople
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                person={selectedPerson}
            />
        </div>
    );
};

export default PersonasPage;
