
import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
    id: Buffer;
    tenant_id: Buffer;
    person_id: Buffer;
    password_hash: string;
    username: string;
    last_login?: Date;
}
