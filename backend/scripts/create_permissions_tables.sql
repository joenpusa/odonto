-- 1. Permisos Maestros (Tú los insertas manualmente al actualizar el sistema)
CREATE TABLE IF NOT EXISTS permissions (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(100) UNIQUE, -- ej: 'users.create'
    description TEXT,
    is_private BOOLEAN DEFAULT FALSE, -- Si es TRUE, solo tú lo ves/asignas
    module VARCHAR(50) -- Para agruparlos en la UI (Ventas, Clínica, etc.)
) ENGINE=InnoDB;

-- 2. Roles por Empresa
CREATE TABLE IF NOT EXISTS roles (
    id BINARY(16) PRIMARY KEY,
    tenant_id BINARY(16) NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_system_role BOOLEAN DEFAULT FALSE, -- Para roles que no se pueden borrar (Admin)
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    -- Evita roles duplicados con el mismo nombre en la misma empresa
    UNIQUE(tenant_id, name) 
) ENGINE=InnoDB;

-- 3. Tabla Puente: Permisos asignados a cada Rol
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BINARY(16) NOT NULL,
    permission_id BINARY(16) NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
) ENGINE=InnoDB;

-- 4. Usuarios (Ya la teníamos, pero ahora amarrada a un Rol)
-- Check if column exists before adding it to avoid errors on re-run
SET @dbname = DATABASE();
SET @tablename = "users";
SET @columnname = "role_id";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE users ADD COLUMN role_id BINARY(16) NULL, ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id);"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;
