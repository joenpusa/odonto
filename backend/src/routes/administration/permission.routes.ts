
import { Router } from 'express';
import { getPermissionsList } from '../../controllers/administration/permission.controller';

const router = Router();

router.get('/', getPermissionsList);

export default router;
