import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const scopeTypes = [
  {
    name: varchar<50>('Tenant'),
    code: varchar<30>('TENANT'),
    description: 'صلاحية على Tenant معين',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: varchar<50>('Workspace'),
    code: varchar<30>('WORKSPACE'),
    description: 'صلاحية على Workspace معين',
    sortOrder: 2,
    isActive: true,
  },
] as const;

export async function seedScopeTypes() {
  for (const scopeType of scopeTypes) {
    await db.orm.public.ScopeType.upsert({
      create: scopeType,
      update: {
        name: scopeType.name,
        description: scopeType.description,
        sortOrder: scopeType.sortOrder,
        isActive: scopeType.isActive,
      },
      conflictOn: {
        code: scopeType.code,
      },
    });
  }

  console.log(
    `✅ Scope Types seeded: ${scopeTypes.length}`,
  );
}