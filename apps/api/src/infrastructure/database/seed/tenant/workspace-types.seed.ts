
import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const workspaceTypes = [
  {
    name: varchar<50>('Marketing'),
    code: varchar<30>('MARKETING'),
    description: 'Workspace for marketing activities',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: varchar<50>('Sales'),
    code: varchar<30>('SALES'),
    description: 'Workspace for sales activities',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: varchar<50>('Support'),
    code: varchar<30>('SUPPORT'),
    description: 'Workspace for customer support activities',
    sortOrder: 3,
    isActive: true,
  },
  {
    name: varchar<50>('General'),
    code: varchar<30>('GENERAL'),
    description: 'General-purpose workspace',
    sortOrder: 4,
    isActive: true,
  },
] as const;

export async function seedWorkspaceTypes() {
  for (const workspaceType of workspaceTypes) {
    await db.orm.public.WorkspaceType.upsert({
      create: workspaceType,
      update: {
        name: workspaceType.name,
        description: workspaceType.description,
        sortOrder: workspaceType.sortOrder,
        isActive: workspaceType.isActive,
      },
      conflictOn: { code: workspaceType.code },
    });
  }

  console.log(`✅ Workspace Types seeded: ${workspaceTypes.length}`);
}
