import { Request, Response } from 'express';
import { getPeople, createPerson, updatePerson, deletePerson } from '@/services/administration/person.service';

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
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.tenantId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { document_type, document_number, phone } = req.body;

        if (!document_type || !document_number) {
            return res.status(400).json({ message: 'Document type and number are required' });
        }

        if (phone && !/^\d+$/.test(phone)) {
            return res.status(400).json({ message: 'Phone must be numeric' });
        }

        await createPerson(req.user.tenantId, req.body);
        res.status(201).json({ message: 'Person created successfully' });
    } catch (error: any) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Person with this document number already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.tenantId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { document_type, document_number, phone } = req.body;

        if (!document_type || !document_number) {
            return res.status(400).json({ message: 'Document type and number are required' });
        }

        if (phone && !/^\d+$/.test(phone)) {
            return res.status(400).json({ message: 'Phone must be numeric' });
        }

        await updatePerson(req.user.tenantId, req.params.id as string, req.body);
        res.json({ message: 'Person updated successfully' });
    } catch (error: any) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Person with this document number already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.tenantId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await deletePerson(req.user.tenantId, req.params.id as string);
        res.json({ message: 'Person deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
