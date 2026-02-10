
import { getPermissions } from '../src/services/permission.service';

const test = async () => {
    try {
        console.log('Testing getPermissions...');
        const result = await getPermissions('', 1, 5);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
    process.exit();
};

test();
