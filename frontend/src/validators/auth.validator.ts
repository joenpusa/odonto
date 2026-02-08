
import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createLoginSchema = (t: TFunction) => z.object({
    tax_id: z.string().min(1, t('auth.company_id_required')),
    username: z.string().min(1, t('auth.username_required')),
    password: z.string().min(1, t('auth.password_required')),
}); ``

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
