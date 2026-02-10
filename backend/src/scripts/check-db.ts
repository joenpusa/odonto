import pool from '@/config/database';
import { RowDataPacket } from 'mysql2';

async function listAll() {
    try {
        const [tenants] = await pool.query<RowDataPacket[]>('SELECT * FROM tenants');
        console.log('Tenants:', tenants);

        const [people] = await pool.query<RowDataPacket[]>('SELECT * FROM people');
        console.log('People:', people);

        const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users');
        console.log('Users:', users);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

listAll();
