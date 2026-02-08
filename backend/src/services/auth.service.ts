import pool from '../config/database';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
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
    username: string;
}

export const authenticateUser = async (tax_id: string, username: string, password: string) => {
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

    // 3. Find User by Username and Tenant
    const [users] = await pool.query<User[]>(
        'SELECT id, person_id, password_hash FROM users WHERE username = ? AND tenant_id = ?',
        [username, tenant.id]
    );

    if (users.length === 0) {
        throw new Error('Invalid credentials'); // User record not found
    }

    const user = users[0];

    // 4. Verify Password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    // 5. Update last_login
    await pool.query(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [user.id]
    );

    // 6. Get Person details for email (optional, but good to return)
    const [people] = await pool.query<Person[]>(
        'SELECT email FROM people WHERE id = ?',
        [user.person_id]
    );
    const email = people.length > 0 ? people[0].email : '';

    // 7. Generate Tokens
    const accessToken = jwt.sign(
        { userId: user.id.toString('hex'), tenantId: tenant.id.toString('hex') },
        process.env.JWT_SECRET as string,
        { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') } as SignOptions
    );

    const refreshToken = jwt.sign(
        { userId: user.id.toString('hex') },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '1d') } as SignOptions
    );

    // TODO: Store refresh token in DB if strict management is needed (not in current schema)

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id.toString('hex'),
            username: username,
            email: email,
            tenant_id: tenant.id.toString('hex'),
        }
    };
};

export const refreshAccessToken = async (refreshToken: string) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as any;

        // Optionally verify user exists in DB:
        const [users] = await pool.query<User[]>(
            'SELECT id, tenant_id FROM users WHERE id = UNHEX(?)',
            [decoded.userId]
        );

        if (users.length === 0) {
            throw new Error('User not found');
        }

        const user = users[0];

        // Generate new Access Token Only
        const newAccessToken = jwt.sign(
            { userId: user.id.toString('hex'), tenantId: user.tenant_id.toString('hex') },
            process.env.JWT_SECRET as string,
            { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') } as SignOptions
        );

        return { accessToken: newAccessToken };
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};
