import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPersonSchema, type PersonFormData } from '@/validators/tables/person.validator';

interface Person {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    document_type: string;
    document_number: string;
    address: string;
}

interface FormPeopleProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Person) => Promise<void>;
    person: Person | null;
}

const FormPeople: React.FC<FormPeopleProps> = ({ isOpen, onClose, onSave, person }) => {
    const { t } = useTranslation();

    const schema = useMemo(() => createPersonSchema(t), [t]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<PersonFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            document_type: '',
            document_number: '',
            address: ''
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (person) {
                reset({
                    first_name: person.first_name,
                    last_name: person.last_name,
                    email: person.email,
                    phone: person.phone || '',
                    document_type: person.document_type || '',
                    document_number: person.document_number || '',
                    address: person.address || ''
                });
            } else {
                reset({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    document_type: '',
                    document_number: '',
                    address: ''
                });
            }
        }
    }, [person, isOpen, reset]);

    if (!isOpen) return null;

    const onSubmit = async (data: PersonFormData) => {
        try {
            // Check if phone, etc are undefined and convert to string if needed, currently they are optional strings in schema
            // but the form data might validly have undefined if optional.
            // However, our backend expects values.
            await onSave({
                ...data,
                id: person?.id,
                phone: data.phone || '',
                document_type: data.document_type || '',
                document_number: data.document_number || '',
                address: data.address || ''
            });
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '600px' }}>
                <div className="modal-header">
                    <h3 className="modal-title">
                        {person ? t('people.edit_title', 'Edit Person') : t('people.create_title', 'Create Person')}
                    </h3>
                    <button onClick={onClose} className="modal-close-btn">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">
                                {t('people.first_name', 'First Name')}
                            </label>
                            <input
                                type="text"
                                {...register('first_name')}
                                className={`form-input ${errors.first_name ? 'input-error' : ''}`}
                            />
                            {errors.first_name && (
                                <span className="error-text">
                                    {errors.first_name.message}
                                </span>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                {t('people.last_name', 'Last Name')}
                            </label>
                            <input
                                type="text"
                                {...register('last_name')}
                                className={`form-input ${errors.last_name ? 'input-error' : ''}`}
                            />
                            {errors.last_name && (
                                <span className="error-text">
                                    {errors.last_name.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">
                                {t('people.document_type', 'Document Type')}
                            </label>
                            <select
                                {...register('document_type')}
                                className={`form-select ${errors.document_type ? 'input-error' : ''}`}
                            >
                                <option value="">{t('common.select')}</option>
                                <option value="CC">{t('people.doc_types.CC')}</option>
                                <option value="TI">{t('people.doc_types.TI')}</option>
                                <option value="CE">{t('people.doc_types.CE')}</option>
                                <option value="PASSPORT">{t('people.doc_types.PASSPORT')}</option>
                            </select>
                            {errors.document_type && (
                                <span className="error-text">
                                    {errors.document_type.message}
                                </span>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                {t('people.document_number', 'Document Number')}
                            </label>
                            <input
                                type="text"
                                {...register('document_number')}
                                className={`form-input ${errors.document_number ? 'input-error' : ''}`}
                            />
                            {errors.document_number && (
                                <span className="error-text">
                                    {errors.document_number.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">
                                {t('people.email', 'Email')}
                            </label>
                            <input
                                type="email"
                                {...register('email')}
                                className={`form-input ${errors.email ? 'input-error' : ''}`}
                            />
                            {errors.email && (
                                <span className="error-text">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                {t('people.phone', 'Phone')}
                            </label>
                            <input
                                type="text"
                                {...register('phone')}
                                className={`form-input ${errors.phone ? 'input-error' : ''}`}
                            />
                            {errors.phone && (
                                <span className="error-text">
                                    {errors.phone.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            {t('people.address', 'Address')}
                        </label>
                        <input
                            type="text"
                            {...register('address')}
                            className={`form-input ${errors.address ? 'input-error' : ''}`}
                        />
                        {errors.address && (
                            <span className="error-text">
                                {errors.address.message}
                            </span>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                        >
                            {t('common.cancel', 'Cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary"
                        >
                            {isSubmitting ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormPeople;
