
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
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '500px' }}>
                <div className="modal-header">
                    <h3 className="modal-title">
                        {permission ? t('permissions.edit_title', 'Edit Permission') : t('permissions.create_title', 'Create Permission')}
                    </h3>
                    <button onClick={onClose} className="modal-close-btn">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
                    <div className="form-group">
                        <label className="form-label">
                            {t('permissions.module', 'Module')}
                        </label>
                        <select
                            {...register('module_id')}
                            className={`form-select ${errors.module_id ? 'input-error' : ''}`}
                        >
                            <option value="" disabled>{t('common.select', 'Select...')}</option>
                            {modules.map(module => (
                                <option key={module.id} value={module.id}>
                                    {module.description}
                                </option>
                            ))}
                        </select>
                        {errors.module_id && (
                            <span className="error-text">
                                {errors.module_id.message}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            {t('permissions.name', 'Name')}
                        </label>
                        <input
                            type="text"
                            {...register('name')}
                            className={`form-input ${errors.name ? 'input-error' : ''}`}
                        />
                        {errors.name && (
                            <span className="error-text">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            {t('permissions.description', 'Description')}
                        </label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                            style={{ resize: 'vertical' }}
                        />
                        {errors.description && (
                            <span className="error-text">
                                {errors.description.message}
                            </span>
                        )}
                    </div>

                    <div className="form-group checkbox-wrapper">
                        <input
                            type="checkbox"
                            id="is_private"
                            {...register('is_private')}
                            className="checkbox-input"
                        />
                        <label htmlFor="is_private" className="checkbox-label">
                            {t('permissions.is_private', 'Is Private?')}
                        </label>
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

export default PermissionModal;
