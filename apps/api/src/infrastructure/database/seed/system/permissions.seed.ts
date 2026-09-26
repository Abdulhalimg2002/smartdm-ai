import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const permissions = [
  {
    name: varchar<150>('Users Read'),
    code: varchar<100>('users.read'),
    description: 'View users',
    permissionGroupCode: varchar<50>('USERS'),
    sortOrder: 1,
    isActive: true,
  },
  {
    name: varchar<150>('Users Create'),
    code: varchar<100>('users.create'),
    description: 'Create users',
    permissionGroupCode: varchar<50>('USERS'),
    sortOrder: 2,
    isActive: true,
  },
  {
    name: varchar<150>('Users Update'),
    code: varchar<100>('users.update'),
    description: 'Update users',
    permissionGroupCode: varchar<50>('USERS'),
    sortOrder: 3,
    isActive: true,
  },
  {
    name: varchar<150>('Users Delete'),
    code: varchar<100>('users.delete'),
    description: 'Delete users',
    permissionGroupCode: varchar<50>('USERS'),
    sortOrder: 4,
    isActive: true,
  },
  {
    name: varchar<150>('Invitations Create'),
    code: varchar<100>('invitations.create'),
    description: 'Create tenant invitations',
    permissionGroupCode: varchar<50>('INVITATIONS'),
    sortOrder: 1,
    isActive: true,
  },
] as const;

export async function seedPermissions() {
  for (const permission of permissions) {
    const permissionGroup =
      await db.orm.public.PermissionGroup
        .where({
          code: permission.permissionGroupCode,
        })
        .first();

    if (!permissionGroup) {
      throw new Error(
        `Permission Group not found: ${permission.permissionGroupCode}`,
      );
    }

    await db.orm.public.Permission.upsert({
      create: {
        name: permission.name,
        code: permission.code,
        description: permission.description,
        permissionGroupId: permissionGroup.id,
        sortOrder: permission.sortOrder,
        isActive: permission.isActive,
      },
      update: {
        name: permission.name,
        description: permission.description,
        permissionGroupId: permissionGroup.id,
        sortOrder: permission.sortOrder,
        isActive: permission.isActive,
      },
      conflictOn: {
        code: permission.code,
      },
    });
  }

  console.log(
    `✅ Permissions seeded: ${permissions.length}`,
  );
}