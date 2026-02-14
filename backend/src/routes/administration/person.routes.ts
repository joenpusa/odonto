import { Router } from 'express';
import { getAll } from '@/controllers/administration/person.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getAll);

export default router;
