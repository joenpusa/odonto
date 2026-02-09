
import { Router } from 'express';
import { getAll } from '../controllers/tenant.controller';

const router = Router();

router.get('/', getAll);

export default router;
