
import pool from '@/config/database';
import { RowDataPacket } from 'mysql2';

async function verifySchema() {
    try {
        console.log('--- Verifying Modules ---');
        const [modules] = await pool.query<RowDataPacket[]>('SELECT HEX(id) as id, description FROM modules');
        console.table(modules);

        console.log('\n--- Verifying Permissions with Module Join ---');
        const [permissions] = await pool.query<RowDataPacket[]>(`
            SELECT 
                HEX(p.id) as permission_id, 
                p.name as permission_name, 
                p.description as permission_desc, 
                HEX(p.module_id) as module_id, 
                m.description as module_name
            FROM permissions p
            JOIN modules m ON p.module_id = m.id
        `);
        console.table(permissions);

        if (modules.length > 0 && permissions.length > 0) {
            console.log('\nVerification SUCCESS: Data found and joins working.');
        } else {
            console.error('\nVerification FAILED: Missing data.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Verification Error:', error);
        process.exit(1);
    }
}

verifySchema();
