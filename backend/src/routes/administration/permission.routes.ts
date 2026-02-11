
import { Router } from 'express';
import { getPermissionsList, getModulesList, create, update, remove } from '@/controllers/administration/permission.controller';

const router = Router();

router.get('/', getPermissionsList);
router.get('/modules', getModulesList);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
