
import pool from '../config/database';

async function addAuthFields() {
    try {
        console.log('Adding auth fields to users table...');

        // Add username column if it doesn't exist
        try {
            await pool.query(
                `ALTER TABLE users ADD COLUMN username VARCHAR(100) UNIQUE AFTER person_id`
            );
            console.log('Added username column');
        } catch (error: any) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('username column already exists');
            } else {
                console.error('Error adding username column:', error);
            }
        }

        // Add last_login column if it doesn't exist
        try {
            await pool.query(
                `ALTER TABLE users ADD COLUMN last_login DATETIME NULL AFTER password_hash`
            );
            console.log('Added last_login column');
        } catch (error: any) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('last_login column already exists');
            } else {
                console.error('Error adding last_login column:', error);
            }
        }

        console.log('Database schema updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating database schema:', error);
        process.exit(1);
    }
}

addAuthFields();
