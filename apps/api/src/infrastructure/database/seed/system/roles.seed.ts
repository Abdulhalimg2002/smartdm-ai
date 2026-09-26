import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const roles = [

  {
    name: varchar<100>('Tenant Owner'),
    code: varchar<50>('TENANT_OWNER'),
    description: 'Owner of a tenant',
    isActive: true,
  },
  {
    name: varchar<100>('Tenant Admin'),
    code: varchar<50>('TENANT_ADMIN'),
    description: 'Administrator of a tenant',
    isActive: true,
  },
  {
    name: varchar<100>('Member'),
    code: varchar<50>('MEMBER'),
    description: 'Standard tenant member',
    isActive: true,
  },
] as const;

export async function seedRoles() {
  for (const role of roles) {
    await db.orm.public.Role.upsert({
      create: role,
      update: {
        name: role.name,
        description: role.description,
        isActive: role.isActive,
      },
      conflictOn: {
        code: role.code,
      },
    });
  }

  console.log(`✅ Roles seeded: ${roles.length}`);
}