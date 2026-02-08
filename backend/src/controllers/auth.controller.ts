import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { authenticateUser } from '../services/auth.service';

const loginSchema = z.object({
    tax_id: z.string().min(1, "Identifier of the company is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export const login = async (req: Request, res: Response) => {
    try {
        const { tax_id, username, password } = loginSchema.parse(req.body);

        const result = await authenticateUser(tax_id, username, password);

        res.json({
            message: req.t('login_successful'),
            ...result,
        });
    } catch (error: any) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: req.t('validation_error'), errors: error.errors });
        } else if (error.message === 'Company not found') {
            res.status(401).json({ message: req.t('company_not_found') });
        } else if (error.message === 'Subscription terminated') {
            res.status(401).json({ message: req.t('subscription_terminated') });
        } else if (error.message === 'Invalid credentials') {
            res.status(401).json({ message: req.t('invalid_credentials') });
        } else {
            console.error(error);
            res.status(500).json({ message: req.t('internal_server_error') });
        }
    }
};

import { refreshAccessToken } from '../services/auth.service';

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token Required' });
    }

    try {
        const result = await refreshAccessToken(refreshToken);
        res.json(result);
    } catch (error) {
        return res.status(403).json({ message: 'Invalid Refresh Token' });
    }
};
