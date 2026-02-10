
import { RowDataPacket } from 'mysql2';

export interface Permission extends RowDataPacket {
    id: Buffer;
    name: string;
    description: string;
    is_private: boolean;
    module: string;
}
