
import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const tenantTypes = [
  {
    name: varchar<50>('Business'),
    code: varchar<30>('BUSINESS'),
    description: 'Company / business activity',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: varchar<50>('Agency'),
    code: varchar<30>('AGENCY'),
    description: 'Marketing agency',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: varchar<50>('Enterprise'),
    code: varchar<30>('ENTERPRISE'),
    description: 'Large company',
    sortOrder: 3,
    isActive: true,
  },
  {
    name: varchar<50>('Individual'),
    code: varchar<30>('INDIVIDUAL'),
    description: 'Independent user',
    sortOrder: 4,
    isActive: true,
  },
] as const;

export async function seedTenantTypes() {
  for (const tenantType of tenantTypes) {
    await db.orm.public.TenantType.upsert({
      create: tenantType,
      update: {
        name: tenantType.name,
        description: tenantType.description,
        sortOrder: tenantType.sortOrder,
        isActive: tenantType.isActive,
      },
      conflictOn: {
        code: tenantType.code,
      },
    });
  }

  console.log(
    `✅ Tenant Types seeded: ${tenantTypes.length}`,
  );
}
