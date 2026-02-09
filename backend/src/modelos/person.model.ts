
import { RowDataPacket } from 'mysql2';

export interface Person extends RowDataPacket {
    id: Buffer;
    tenant_id: Buffer;
    email: string;
    first_name?: string;
    last_name?: string;
}
