import { Router } from 'express';
import { getAll, create, update, remove } from '@/controllers/administration/person.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getAll);

router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
