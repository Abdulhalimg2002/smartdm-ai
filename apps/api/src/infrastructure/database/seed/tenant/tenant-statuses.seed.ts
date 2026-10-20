
import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const tenantStatuses = [
  {
    name: varchar<50>('Pending'),
    code: varchar<30>('PENDING'),
    description: 'Tenant is awaiting activation',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: varchar<50>('Active'),
    code: varchar<30>('ACTIVE'),
    description: 'Tenant is active and available for use',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: varchar<50>('Suspended'),
    code: varchar<30>('SUSPENDED'),
    description: 'Tenant access is temporarily suspended',
    sortOrder: 3,
    isActive: true,
  },
  {
    name: varchar<50>('Disabled'),
    code: varchar<30>('DISABLED'),
    description: 'Tenant has been disabled',
    sortOrder: 4,
    isActive: true,
  },
  {
    name: varchar<50>('Archived'),
    code: varchar<30>('ARCHIVED'),
    description: 'Tenant has been archived',
    sortOrder: 5,
    isActive: true,
  },
] as const;

export async function seedTenantStatuses() {
  for (const tenantStatus of tenantStatuses) {
    await db.orm.public.TenantStatus.upsert({
      create: tenantStatus,
      update: {
        name: tenantStatus.name,
        description: tenantStatus.description,
        sortOrder: tenantStatus.sortOrder,
        isActive: tenantStatus.isActive,
      },
      conflictOn: {
        code: tenantStatus.code,
      },
    });
  }

  console.log(
    `✅ Tenant Statuses seeded: ${tenantStatuses.length}`,
  );
}
