
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPermissionSchema, type PermissionFormData } from '@/validators/administration/permission.validator';

interface Module {
    id: string;
    description: string;
}

interface Permission {
    id?: string;
    name: string;
    description: string;
    is_private: boolean;
    module_id: string;
}

interface PermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Permission) => Promise<void>;
    permission: Permission | null;
    modules: Module[];
}



const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onClose, onSave, permission, modules }) => {
    const { t } = useTranslation();

    // Create the schema with the translation function
    const schema = useMemo(() => createPermissionSchema(t), [t]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<PermissionFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            is_private: false,
            module_id: ''
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (permission) {
                reset({
                    name: permission.name,
                    description: permission.description,
                    is_private: permission.is_private,
                    module_id: permission.module_id
                });
            } else {
                reset({
                    name: '',
                    description: '',
                    is_private: false,
                    module_id: modules.length > 0 ? modules[0].id : ''
                });
            }
        }
    }, [permission, modules, isOpen, reset]);

    if (!isOpen) return null;

    const onSubmit = async (data: PermissionFormData) => {
        try {
            await onSave(data);
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
                width: '500px',
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
                        {permission ? t('permissions.edit_title', 'Edit Permission') : t('permissions.create_title', 'Create Permission')}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                            {t('permissions.module', 'Module')}
                        </label>
                        <select
                            {...register('module_id')}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: `1px solid ${errors.module_id ? '#ef4444' : '#d1d5db'}`,
                                fontSize: '1rem',
                                boxSizing: 'border-box'
                            }}
                        >
                            <option value="" disabled>{t('common.select', 'Select...')}</option>
                            {modules.map(module => (
                                <option key={module.id} value={module.id}>
                                    {module.description}
                                </option>
                            ))}
                        </select>
                        {errors.module_id && (
                            <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                                {errors.module_id.message}
                            </span>
                        )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                            {t('permissions.name', 'Name')}
                        </label>
                        <input
                            type="text"
                            {...register('name')}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: `1px solid ${errors.name ? '#ef4444' : '#d1d5db'}`,
                                fontSize: '1rem',
                                boxSizing: 'border-box'
                            }}
                        />
                        {errors.name && (
                            <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' }}>
                            {t('permissions.description', 'Description')}
                        </label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: `1px solid ${errors.description ? '#ef4444' : '#d1d5db'}`,
                                fontSize: '1rem',
                                resize: 'vertical',
                                boxSizing: 'border-box'
                            }}
                        />
                        {errors.description && (
                            <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                                {errors.description.message}
                            </span>
                        )}
                    </div>

                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            id="is_private"
                            {...register('is_private')}
                            style={{ width: '16px', height: '16px', marginRight: '8px', cursor: 'pointer', marginTop: 0 }}
                        />
                        <label htmlFor="is_private" style={{ cursor: 'pointer', color: '#374151', lineHeight: '16px', userSelect: 'none' }}>
                            {t('permissions.is_private', 'Is Private?')}
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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

export default PermissionModal;
