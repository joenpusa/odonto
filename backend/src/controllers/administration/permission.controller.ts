
import { Request, Response } from 'express';
import { getPermissions } from '@/services/administration/permission.service';

export const getPermissionsList = async (req: Request, res: Response) => {
    try {
        const { search, page, limit } = req.query;
        const pageNum = page ? Number(page) : 1;
        const limitNum = limit ? Number(limit) : 10;

        const result = await getPermissions(
            (search as string) || '',
            pageNum,
            limitNum
        );
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
