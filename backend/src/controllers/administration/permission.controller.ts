
import { Request, Response } from 'express';
import { getPermissions, getModules, createPermission, updatePermission, deletePermission } from '@/services/administration/permission.service';

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

export const getModulesList = async (req: Request, res: Response) => {
    try {
        const modules = await getModules();
        res.json(modules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        await createPermission(req.body);
        res.status(201).json({ message: 'Permission created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await updatePermission(id, req.body);
        res.json({ message: 'Permission updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await deletePermission(id);
        res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
