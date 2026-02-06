import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { authenticateUser } from '../services/auth.service';

const loginSchema = z.object({
    tax_id: z.string().min(1, "Identifier of the company is required"),
    username: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

export const login = async (req: Request, res: Response) => {
    try {
        const { tax_id, username, password } = loginSchema.parse(req.body);

        const result = await authenticateUser(tax_id, username, password);

        res.json({
            message: "Login successful",
            ...result,
        });
    } catch (error: any) {
        if (error instanceof ZodError) {
            res.status(400).json({ message: "Validation error", errors: error.errors });
        } else if (error.message === 'Company not found' || error.message === 'Subscription terminated' || error.message === 'Invalid credentials') {
            res.status(401).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
