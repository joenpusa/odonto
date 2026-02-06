import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

async function listUsers() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT p.first_name, p.last_name, p.email, u.id FROM users u JOIN people p ON u.person_id = p.id AND u.tenant_id = p.tenant_id');
        console.log('Users found:', rows);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

listUsers();
