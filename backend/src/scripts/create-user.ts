import pool from '../config/database';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

async function createUser() {
    try {
        const email = 'joenpusa@gmail.com';
        const username = 'joenpusa';
        const password = 'admin123';

        // 1. Find Person
        const [people] = await pool.query<RowDataPacket[]>(
            'SELECT id, tenant_id FROM people WHERE email = ?',
            [email]
        );

        if (people.length === 0) {
            console.error('Person not found');
            process.exit(1);
        }

        const person = people[0];
        console.log('Found Person:', person);

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create User ID (UUID v4)
        // Since we are using BINARY(16), we need to insert it correctly.
        // We can use MySQL's UUID_TO_BIN(UUID()) if we were running raw SQL, 
        // but here we are using a library. 
        // Let's use a raw query with UUID_TO_BIN(UUID()) for the ID.

        try {
            await pool.query(
                `INSERT INTO users (id, tenant_id, person_id, username, password_hash) 
           VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?)`,
                [person.tenant_id, person.id, username, hashedPassword]
            );

            console.log(`User created successfully for ${email} with username: ${username} and password: ${password}`);
            process.exit(0);
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                console.error('User already exists (duplicate entry)');
            } else {
                console.error('Error inserting user:', error);
            }
            process.exit(1);
        }
    } catch (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }
}

createUser();
