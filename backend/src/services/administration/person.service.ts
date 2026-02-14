import pool from '@/config/database';
import { Person } from '@/modelos/administration/person.model';

export const getPeople = async (tenantId: string, search: string = '', page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;
    // Updated query to include new fields
    let query = 'SELECT id, first_name, last_name, email, phone, document_type, document_number, address FROM people WHERE tenant_id = UNHEX(?)';
    const params: any[] = [tenantId];

    if (search) {
        query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR document_number LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Order by first_name instead.
    query += ' ORDER BY first_name ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query<Person[]>(query, params);

    // Count total for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM people WHERE tenant_id = UNHEX(?)';
    const countParams: any[] = [tenantId];
    if (search) {
        countQuery += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR document_number LIKE ?)';
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query<any[]>(countQuery, countParams);
    const total = countResult[0].total;

    return {
        data: rows.map(row => ({
            ...row,
            id: row.id.toString('hex'),
        })),
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const createPerson = async (tenantId: string, data: Omit<Person, 'id' | 'tenant_id'>) => {
    const query = `
        INSERT INTO people (id, tenant_id, first_name, last_name, email, phone, document_type, document_number, address)
        VALUES (UUID_TO_BIN(UUID()), UNHEX(?), ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        tenantId,
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.document_type,
        data.document_number,
        data.address
    ];
    await pool.query(query, params);
};

export const updatePerson = async (tenantId: string, id: string, data: Partial<Omit<Person, 'id' | 'tenant_id'>>) => {
    const query = `
        UPDATE people 
        SET first_name = ?, last_name = ?, email = ?, phone = ?, document_type = ?, document_number = ?, address = ?
        WHERE id = UNHEX(?) AND tenant_id = UNHEX(?)
    `;
    const params = [
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.document_type,
        data.document_number,
        data.address,
        id,
        tenantId
    ];
    await pool.query(query, params);
};

export const deletePerson = async (tenantId: string, id: string) => {
    const query = 'DELETE FROM people WHERE id = UNHEX(?) AND tenant_id = UNHEX(?)';
    await pool.query(query, [id, tenantId]);
};
