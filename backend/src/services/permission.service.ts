
import pool from '../config/database';
import { Permission } from '../modelos/permission.model';
import { ResultSetHeader } from 'mysql2';

export const getPermissions = async (search: string = '', page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;

    let query = 'SELECT HEX(id) as id, name, description, is_private, module FROM permissions';
    const params: any[] = [];

    if (search) {
        query += ' WHERE name LIKE ? OR description LIKE ? OR module LIKE ?';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY module, name LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query<Permission[]>(query, params);

    // Count total
    let countQuery = 'SELECT COUNT(*) as total FROM permissions';
    const countParams: any[] = [];

    if (search) {
        countQuery += ' WHERE name LIKE ? OR description LIKE ? OR module LIKE ?';
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
