
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import api from '@/api/axios';
import { useToast } from '@/context/ToastContext';

interface Company {
    id: string;
    tax_id: string;
    name: string;
    active: boolean;
    created_at: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const CompaniesPage: React.FC = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    const fetchCompanies = useCallback(async (searchTerm: string, pageNum: number) => {
        setLoading(true);
        try {
            const response = await api.get('/tenants', {
                params: {
                    search: searchTerm,
                    page: pageNum,
                    limit: 10
                }
            });
            setCompanies(response.data.data);
            setPagination(response.data.meta);
        } catch (error) {
            console.error(error);
            addToast(t('common.unexpected_error'), 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast, t]);

    useEffect(() => {
        // Debounce search
        const delayDebounceFn = setTimeout(() => {
            fetchCompanies(search, page);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, page, fetchCompanies]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">
                    {t('companies.title')}
                </h2>
                <div className="search-container">
                    <Search
                        size={20}
                        className="search-icon"
                    />
                    <input
                        type="text"
                        placeholder={t('companies.search_placeholder')}
                        value={search}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>{t('companies.name')}</th>
                            <th>{t('companies.tax_id')}</th>
                            <th>{t('companies.status')}</th>
                            <th>{t('companies.created_at')}</th>
                            <th style={{ textAlign: 'right' }}>{t('companies.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                    Loading...
                                </td>
                            </tr>
                        ) : companies.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                    No companies found.
                                </td>
                            </tr>
                        ) : (
                            companies.map((company) => (
                                <tr key={company.id}>
                                    <td style={{ fontWeight: 500 }}>
                                        {company.name}
                                    </td>
                                    <td style={{ color: '#4b5563' }}>
                                        {company.tax_id}
                                    </td>
                                    <td>
                                        {company.active ? (
                                            <span className="badge badge-success">
                                                <CheckCircle size={14} style={{ marginRight: '4px' }} />
                                                {t('companies.active')}
                                            </span>
                                        ) : (
                                            <span className="badge badge-danger">
                                                <XCircle size={14} style={{ marginRight: '4px' }} />
                                                {t('companies.inactive')}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                        {new Date(company.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className="btn-link">
                                            Edit
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
                            Page {pagination.page} of {pagination.totalPages}
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
        </div>
    );
};

export default CompaniesPage;
