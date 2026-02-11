
import pool from '@/config/database';
import { Permission } from '@/modelos/administration/permission.model';
import { ResultSetHeader } from 'mysql2';

export const getPermissions = async (search: string = '', page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;

    let query = `
        SELECT HEX(p.id) as id, p.name, p.description, p.is_private, HEX(p.module_id) as module_id, m.description as module_name 
        FROM permissions p
        JOIN modules m ON p.module_id = m.id
    `;
    const params: any[] = [];

    if (search) {
        query += ' WHERE p.name LIKE ? OR p.description LIKE ? OR m.description LIKE ?';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY m.description, p.name LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query<Permission[]>(query, params);

    // Count total
    let countQuery = `
        SELECT COUNT(*) as total 
        FROM permissions p
        JOIN modules m ON p.module_id = m.id
    `;
    const countParams: any[] = [];

    if (search) {
        countQuery += ' WHERE p.name LIKE ? OR p.description LIKE ? OR m.description LIKE ?';
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query<any>(countQuery, countParams);
    const total = countResult[0].total;

    return {
        data: rows,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        }
    };
};
