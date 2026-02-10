
import { Router } from 'express';
import { getPermissionsList } from '../controllers/permission.controller';

const router = Router();

router.get('/', getPermissionsList);

export default router;
