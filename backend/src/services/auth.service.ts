import pool from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

interface Tenant extends RowDataPacket {
    id: Buffer;
    tax_id: string;
    deactivated_at: Date | null;
}

interface Person extends RowDataPacket {
    id: Buffer;
    tenant_id: Buffer;
    email: string;
}

interface User extends RowDataPacket {
    id: Buffer;
    tenant_id: Buffer;
    person_id: Buffer;
    password_hash: string;
}

export const authenticateUser = async (tax_id: string, email: string, password: string) => {
    // 1. Find Tenant
    const [tenants] = await pool.query<Tenant[]>(
        'SELECT id, tax_id, deactivated_at FROM tenants WHERE tax_id = ?',
        [tax_id]
    );

    if (tenants.length === 0) {
        throw new Error('Company not found');
    }

    const tenant = tenants[0];

    // 2. Check Subscription
    if (tenant.deactivated_at) {
        const deactivatedDate = new Date(tenant.deactivated_at);
        const currentDate = new Date();
        if (deactivatedDate < currentDate) {
            throw new Error('Subscription terminated');
        }
    }

    // 3. Find Person by Email and Tenant
    const [people] = await pool.query<Person[]>(
        'SELECT id, tenant_id FROM people WHERE email = ? AND tenant_id = ?',
        [email, tenant.id]
    );

    if (people.length === 0) {
        throw new Error('Invalid credentials'); // User (person) not found
    }

    const person = people[0];

    // 4. Find User by Person and Tenant
    const [users] = await pool.query<User[]>(
        'SELECT id, password_hash FROM users WHERE person_id = ? AND tenant_id = ?',
        [person.id, tenant.id]
    );

    if (users.length === 0) {
        throw new Error('Invalid credentials'); // User record not found
    }

    const user = users[0];

    // 5. Verify Password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    // 6. Generate Tokens
    const accessToken = jwt.sign(
        { userId: user.id.toString('hex'), tenantId: tenant.id.toString('hex') },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { userId: user.id.toString('hex') },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '7d' }
    );

    // TODO: Store refresh token in DB if strict management is needed (not in current schema)

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id.toString('hex'),
            email: email,
            tenant_id: tenant.id.toString('hex'),
        }
    };
};
