
import pool from '@/config/database';
import { RowDataPacket } from 'mysql2';

async function updateSchema() {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        console.log('1. Deleting existing data from permissions...');
        await connection.query('DELETE FROM permissions');

        console.log('2. Altering permissions table (renaming module to module_id)...');
        // Check if module column is already binary(16) or char? Old schema had 'module' as string (varchar likely).
        // converting to BINARY(16) requires care if we wanted to keep data, but we deleted it.
        // So we can just change the column type.
        // NOTE: We need to drop the old column and add new because 'CHANGE COLUMN' with type change might be tricky if not strictly compatible or if we want clarity.
        // But 'CHANGE COLUMN module module_id BINARY(16)' should work since table is empty.

        // First check if column exists and what type
        const [columns] = await connection.query<RowDataPacket[]>(
            `SHOW COLUMNS FROM permissions LIKE 'module'`
        );

        if (columns.length > 0) {
            await connection.query('ALTER TABLE permissions CHANGE COLUMN module module_id BINARY(16) NOT NULL');
        } else {
            // check if module_id already exists (idempotency)
            const [columnsId] = await connection.query<RowDataPacket[]>(
                `SHOW COLUMNS FROM permissions LIKE 'module_id'`
            );
            if (columnsId.length === 0) {
                // Should not happen based on requirements, but fallback
                await connection.query('ALTER TABLE permissions ADD COLUMN module_id BINARY(16) NOT NULL');
            }
        }

        console.log('3. Creating Modules table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Modules (
                id BINARY(16) PRIMARY KEY,
                description VARCHAR(255) NOT NULL
            )
        `);

        console.log('4. Creating "Administracion" module...');
        // Insert if not exists (or we just created table). usage of UUID_TO_BIN(UUID())
        await connection.query(`
            INSERT INTO Modules (id, description) 
            VALUES (UUID_TO_BIN(UUID()), 'Administracion')
        `);

        // Get the ID
        const [modules] = await connection.query<RowDataPacket[]>(
            `SELECT id FROM Modules WHERE description = 'Administracion'`
        );
        const adminModuleId = modules[0].id; // This is a Buffer

        console.log('5. Adding foreign key constraint...');
        // Check if FK exists
        const [fks] = await connection.query<RowDataPacket[]>(
            `SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE 
             WHERE TABLE_NAME = 'permissions' AND CONSTRAINT_NAME = 'fk_permissions_modules' AND TABLE_SCHEMA = DATABASE()`
        );

        if (fks.length === 0) {
            await connection.query(
                `ALTER TABLE permissions ADD CONSTRAINT fk_permissions_modules FOREIGN KEY (module_id) REFERENCES Modules(id)`
            );
        }

        console.log('6. Creating new permissions...');
        const permissions = [
            { name: 'admin.permisos', description: 'Permisos de administracion' }, // made up description
            { name: 'admin.empresas', description: 'Gestion de empresas' }
        ];

        for (const perm of permissions) {
            await connection.query(
                `INSERT INTO permissions (id, name, description, is_private, module_id)
                 VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?)`,
                [perm.name, perm.description, true, adminModuleId]
            ); // Assuming is_private = true for admin stuff, or false? defaulting to true.
        }

        await connection.commit();
        console.log('Schema update and data migration completed successfully.');
        process.exit(0);

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error updating schema:', error);
        process.exit(1);
    } finally {
        if (connection) connection.release();
    }
}

updateSchema();
