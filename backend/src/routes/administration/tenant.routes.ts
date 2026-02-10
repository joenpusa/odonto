
import { Router } from 'express';
import { getAll } from '@/controllers/administration/tenant.controller';

const router = Router();

router.get('/', getAll);

export default router;
