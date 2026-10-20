
import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const workspaceStatuses = [
  {
    name: varchar<50>('Pending'),
    code: varchar<30>('PENDING'),
    description: 'Workspace is awaiting activation',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: varchar<50>('Active'),
    code: varchar<30>('ACTIVE'),
    description: 'Workspace is active and available for use',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: varchar<50>('Suspended'),
    code: varchar<30>('SUSPENDED'),
    description: 'Workspace access is temporarily suspended',
    sortOrder: 3,
    isActive: true,
  },
  {
    name: varchar<50>('Archived'),
    code: varchar<30>('ARCHIVED'),
    description: 'Workspace has been archived',
    sortOrder: 4,
    isActive: true,
  },
] as const;

export async function seedWorkspaceStatuses() {
  for (const workspaceStatus of workspaceStatuses) {
    await db.orm.public.WorkspaceStatus.upsert({
      create: workspaceStatus,
      update: {
        name: workspaceStatus.name,
        description: workspaceStatus.description,
        sortOrder: workspaceStatus.sortOrder,
        isActive: workspaceStatus.isActive,
      },
      conflictOn: { code: workspaceStatus.code },
    });
  }

  console.log(`✅ Workspace Statuses seeded: ${workspaceStatuses.length}`);
}
