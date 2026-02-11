
const API_URL = 'http://localhost:3000/api/permissions';

async function verifyCrud() {
    try {
        console.log('1. Fetching Modules...');
        const modulesRes = await fetch(`${API_URL}/modules`);
        if (!modulesRes.ok) throw new Error(`Failed to fetch modules: ${modulesRes.statusText}`);
        const modules = await modulesRes.json();
        console.log('Modules:', modules.length);
        if (modules.length === 0) throw new Error('No modules found');
        const moduleId = modules[0].id;

        console.log('2. Creating Permission...');
        const newPermission = {
            name: 'test.permission',
            description: 'Test Description',
            is_private: false,
            module_id: moduleId
        };
        const createRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPermission)
        });
        if (!createRes.ok) throw new Error(`Failed to create permission: ${createRes.statusText}`);
        console.log('Permission created.');

        console.log('3. Listing Permissions...');
        const listRes = await fetch(`${API_URL}?search=test.permission`);
        if (!listRes.ok) throw new Error(`Failed to list permissions: ${listRes.statusText}`);
        const listData = await listRes.json();
        const createdPerm = listData.data.find((p: any) => p.name === 'test.permission');
        if (!createdPerm) throw new Error('Created permission not found in list');
        console.log('Permission found:', createdPerm.id);

        console.log('4. Updating Permission...');
        const updateRes = await fetch(`${API_URL}/${createdPerm.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'test.permission.updated',
                description: 'Updated Description',
                is_private: true,
                module_id: moduleId
            })
        });
        if (!updateRes.ok) throw new Error(`Failed to update permission: ${updateRes.statusText}`);
        console.log('Permission updated.');

        console.log('5. Verifying Update...');
        const updatedListRes = await fetch(`${API_URL}?search=test.permission.updated`);
        if (!updatedListRes.ok) throw new Error(`Failed to list permissions after update: ${updatedListRes.statusText}`);
        const updatedListData = await updatedListRes.json();
        const updatedPerm = updatedListData.data.find((p: any) => p.name === 'test.permission.updated');
        if (!updatedPerm) throw new Error('Updated permission not found');
        if (updatedPerm.description !== 'Updated Description') throw new Error('Description not updated');
        console.log('Update verified.');

        console.log('6. Deleting Permission...');
        const deleteRes = await fetch(`${API_URL}/${createdPerm.id}`, {
            method: 'DELETE'
        });
        if (!deleteRes.ok) throw new Error(`Failed to delete permission: ${deleteRes.statusText}`);
        console.log('Permission deleted.');

        console.log('7. Verifying Deletion...');
        const deletedListRes = await fetch(`${API_URL}?search=test.permission.updated`);
        if (!deletedListRes.ok) throw new Error(`Failed to list permissions after delete: ${deletedListRes.statusText}`);
        const deletedListData = await deletedListRes.json();
        const deletedPerm = deletedListData.data.find((p: any) => p.name === 'test.permission.updated');
        if (deletedPerm) throw new Error('Permission still exists after deletion');
        console.log('Deletion verified.');

        console.log('CRUD Verification SUCCESS');
    } catch (error: any) {
        console.error('Verification FAILED:', error.message);
        process.exit(1);
    }
}

verifyCrud();
