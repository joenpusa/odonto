
import { RowDataPacket } from 'mysql2';

export interface Tenant extends RowDataPacket {
    id: Buffer;
    tax_id: string;
    name: string;
    deactivated_at: Date | null;
    created_at: Date;
}
