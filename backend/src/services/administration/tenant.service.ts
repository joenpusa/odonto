
import pool from '@/config/database';


import { Tenant } from '@/modelos/administration/tenant.model';

export const getTenants = async (search: string = '', page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;
    let query = 'SELECT id, tax_id, name, deactivated_at, created_at FROM tenants';
    const params: any[] = [];

    if (search) {
        query += ' WHERE name LIKE ? OR tax_id LIKE ?';
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query<Tenant[]>(query, params);

    // Count total for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM tenants';
    const countParams: any[] = [];
    if (search) {
        countQuery += ' WHERE name LIKE ? OR tax_id LIKE ?';
        countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query<any[]>(countQuery, countParams);
    const total = countResult[0].total;

    return {
        data: rows.map(row => ({
            ...row,
            id: row.id.toString('hex'), // Convert Buffer to hex string for frontend
            active: !row.deactivated_at
        })),
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
