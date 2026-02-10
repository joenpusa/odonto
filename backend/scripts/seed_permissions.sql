
INSERT INTO permissions (id, name, description, is_private, module) VALUES
(UNHEX(REPLACE(UUID(), '-', '')), 'users.view', 'Ver usuarios', FALSE, 'Usuarios'),
(UNHEX(REPLACE(UUID(), '-', '')), 'users.create', 'Crear usuarios', FALSE, 'Usuarios'),
(UNHEX(REPLACE(UUID(), '-', '')), 'users.edit', 'Editar usuarios', FALSE, 'Usuarios'),
(UNHEX(REPLACE(UUID(), '-', '')), 'users.delete', 'Eliminar usuarios', TRUE, 'Usuarios'),
(UNHEX(REPLACE(UUID(), '-', '')), 'roles.view', 'Ver roles', FALSE, 'Administración'),
(UNHEX(REPLACE(UUID(), '-', '')), 'roles.manage', 'Gestionar roles', FALSE, 'Administración');
