import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const rolePermissions = [
  // TENANT_OWNER
  {
    roleCode: varchar<50>('TENANT_OWNER'),
    permissionCode: varchar<100>('users.read'),
  },
  {
    roleCode: varchar<50>('TENANT_OWNER'),
    permissionCode: varchar<100>('users.create'),
  },
  {
    roleCode: varchar<50>('TENANT_OWNER'),
    permissionCode: varchar<100>('users.update'),
  },
  {
    roleCode: varchar<50>('TENANT_OWNER'),
    permissionCode: varchar<100>('users.delete'),
  },
  {
    roleCode: varchar<50>('TENANT_OWNER'),
    permissionCode: varchar<100>('invitations.create'),
  },

  // TENANT_ADMIN
  {
    roleCode: varchar<50>('TENANT_ADMIN'),
    permissionCode: varchar<100>('users.read'),
  },
  {
    roleCode: varchar<50>('TENANT_ADMIN'),
    permissionCode: varchar<100>('users.create'),
  },
  {
    roleCode: varchar<50>('TENANT_ADMIN'),
    permissionCode: varchar<100>('users.update'),
  },
  {
    roleCode: varchar<50>('TENANT_ADMIN'),
    permissionCode: varchar<100>('invitations.create'),
  },

  // MEMBER
  {
    roleCode: varchar<50>('MEMBER'),
    permissionCode: varchar<100>('users.read'),
  },
] as const;

export async function seedRolePermissions() {
  for (const rolePermission of rolePermissions) {
    const role = await db.orm.public.Role
      .where({
        code: rolePermission.roleCode,
      })
      .first();

    if (!role) {
      throw new Error(
        `Role not found: ${rolePermission.roleCode}`,
      );
    }

    const permission = await db.orm.public.Permission
      .where({
        code: rolePermission.permissionCode,
      })
      .first();

    if (!permission) {
      throw new Error(
        `Permission not found: ${rolePermission.permissionCode}`,
      );
    }

    await db.orm.public.RolePermission.upsert({
      create: {
        roleId: role.id,
        permissionId: permission.id,
      },
      update: {},
      conflictOn: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });
  }

  console.log(
    `✅ Role Permissions seeded: ${rolePermissions.length}`,
  );
}