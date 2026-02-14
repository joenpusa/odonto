import { Request, Response } from 'express';
import { getPeople } from '@/services/administration/person.service';

export const getAll = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.tenantId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';

        const result = await getPeople(req.user.tenantId, search, page, limit);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('internal_server_error') });
    }
};
