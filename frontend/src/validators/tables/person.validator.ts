import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createPersonSchema = (t: TFunction) => z.object({
    first_name: z.string().min(1, { message: t('common.required') }),
    last_name: z.string().min(1, { message: t('common.required') }),
    email: z.string().email({ message: t('common.invalid_email') }).min(1, { message: t('common.required') }),
    phone: z.string().regex(/^\d+$/, { message: t('common.numeric_only') }).optional().or(z.literal('')),
    document_type: z.string().min(1, { message: t('common.required') }),
    document_number: z.string().min(1, { message: t('common.required') }),
    address: z.string().optional()
});

export type PersonFormData = z.infer<ReturnType<typeof createPersonSchema>>;
