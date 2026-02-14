import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/api/axios';
import { useToast } from '@/context/ToastContext';

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

    return (
        <div>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>
                    {t('people.title')}
                </h2>
                <div style={{ position: 'relative' }}>
                    <Search
                        size={20}
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                    />
                    <input
                        type="text"
                        placeholder={t('people.search_placeholder')}
                        value={search}
                        onChange={handleSearchChange}
                        style={{
                            padding: '10px 10px 10px 40px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            width: '300px',
                            fontSize: '0.95rem',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#374151', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {t('people.name')}
                            </th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#374151', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {t('people.dni')}
                            </th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#374151', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {t('people.email')}
                            </th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#374151', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {t('people.phone')}
                            </th>
                            <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: '#374151', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {t('people.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                    Loading...
                                </td>
                            </tr>
                        ) : people.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                    {t('people.no_results')}
                                </td>
                            </tr>
                        ) : (
                            people.map((person) => (
                                <tr key={person.id} style={{ borderBottom: '1px solid #f3f4f6' }} className="hover:bg-gray-50">
                                    <td style={{ padding: '16px', color: '#111827', fontWeight: 500 }}>
                                        {person.first_name} {person.last_name}
                                    </td>
                                    <td style={{ padding: '16px', color: '#4b5563' }}>
                                        {person.document_number || '-'}
                                    </td>
                                    <td style={{ padding: '16px', color: '#4b5563' }}>
                                        {person.email || '-'}
                                    </td>
                                    <td style={{ padding: '16px', color: '#4b5563' }}>
                                        {person.phone || '-'}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button style={{ color: '#2563eb', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {pagination && pagination.totalPages > 1 && (
                    <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                            {t('common.page')} {pagination.page} {t('common.of')} {pagination.totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                                style={{
                                    display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: page <= 1 ? '#f3f4f6' : '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer', color: page <= 1 ? '#9ca3af' : '#374151'
                                }}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= pagination.totalPages}
                                style={{
                                    display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: page >= pagination.totalPages ? '#f3f4f6' : '#fff', cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer', color: page >= pagination.totalPages ? '#9ca3af' : '#374151'
                                }}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonasPage;
