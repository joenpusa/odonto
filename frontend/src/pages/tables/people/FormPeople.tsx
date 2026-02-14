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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '600px',
                maxWidth: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
                        {person ? t('people.edit_title', 'Edit Person') : t('people.create_title', 'Create Person')}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                                {t('people.first_name', 'First Name')}
                            </label>
                            <input
                                type="text"
                                {...register('first_name')}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: `1px solid ${errors.first_name ? '#ef4444' : '#d1d5db'}`,
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {errors.first_name && (
                                <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                                    {errors.first_name.message}
                                </span>
                            )}
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                                {t('people.last_name', 'Last Name')}
                            </label>
                            <input
                                type="text"
                                {...register('last_name')}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: `1px solid ${errors.last_name ? '#ef4444' : '#d1d5db'}`,
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {errors.last_name && (
                                <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                                    {errors.last_name.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                                {t('people.document_type', 'Document Type')}
                            </label>
                            <select
                                {...register('document_type')}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: `1px solid ${errors.document_type ? '#ef4444' : '#d1d5db'}`,
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <option value="">{t('common.select')}</option>
                                <option value="CC">{t('people.doc_types.CC')}</option>
                                <option value="TI">{t('people.doc_types.TI')}</option>
                                <option value="CE">{t('people.doc_types.CE')}</option>
                                <option value="PASSPORT">{t('people.doc_types.PASSPORT')}</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                                {t('people.document_number', 'Document Number')}
                            </label>
                            <input
                                type="text"
                                {...register('document_number')}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: `1px solid ${errors.document_number ? '#ef4444' : '#d1d5db'}`,
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                                {t('people.email', 'Email')}
                            </label>
                            <input
                                type="email"
                                {...register('email')}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {errors.email && (
                                <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                                    {errors.email.message}
                                </span>
                            )}
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                                {t('people.phone', 'Phone')}
                            </label>
                            <input
                                type="text"
                                {...register('phone')}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: `1px solid ${errors.phone ? '#ef4444' : '#d1d5db'}`,
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                            {t('people.address', 'Address')}
                        </label>
                        <input
                            type="text"
                            {...register('address')}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: `1px solid ${errors.address ? '#ef4444' : '#d1d5db'}`,
                                fontSize: '1rem',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                backgroundColor: 'white',
                                color: '#374151',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            {t('common.cancel', 'Cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                fontWeight: 500,
                                opacity: isSubmitting ? 0.7 : 1
                            }}
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
