import { RowDataPacket } from 'mysql2';

export interface Person extends RowDataPacket {
    id: Buffer;
    tenant_id: Buffer;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    document_type: string | null;
    document_number: string | null;
    address: string | null;
}
