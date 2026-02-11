
import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createPermissionSchema = (t: TFunction) => z.object({
    module_id: z.string().min(1, { message: t('common.required') }),
    name: z.string().min(1, { message: t('common.required') }),
    description: z.string().min(1, { message: t('common.required') }),
    is_private: z.boolean()
});

export type PermissionFormData = z.infer<ReturnType<typeof createPermissionSchema>>;
