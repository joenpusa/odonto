
import { Request, Response } from 'express';
import { getTenants } from '../services/tenant.service';

export const getAll = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';

        const result = await getTenants(search, page, limit);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: req.t('internal_server_error') });
    }
};
