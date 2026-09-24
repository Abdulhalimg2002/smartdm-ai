import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const permissionGroups = [
  {
    name: varchar<100>('Users'),
    code: varchar<50>('USERS'),
    description: null,
    sortOrder: 1,
    isActive: true,
  },
  {
    name: varchar<100>('CRM'),
    code: varchar<50>('CRM'),
    description: null,
    sortOrder: 2,
    isActive: true,
  },
  {
    name: varchar<100>('Social Inbox'),
    code: varchar<50>('SOCIAL_INBOX'),
    description: null,
    sortOrder: 3,
    isActive: true,
  },
  {
    name: varchar<100>('Automation'),
    code: varchar<50>('AUTOMATION'),
    description: null,
    sortOrder: 4,
    isActive: true,
  },
  {
    name: varchar<100>('AI'),
    code: varchar<50>('AI'),
    description: null,
    sortOrder: 5,
    isActive: true,
  },
  {
    name: varchar<100>('Analytics'),
    code: varchar<50>('ANALYTICS'),
    description: null,
    sortOrder: 6,
    isActive: true,
  },
  {
    name: varchar<100>('Billing'),
    code: varchar<50>('BILLING'),
    description: null,
    sortOrder: 7,
    isActive: true,
  },
  {
    name: varchar<100>('Notifications'),
    code: varchar<50>('NOTIFICATIONS'),
    description: null,
    sortOrder: 8,
    isActive: true,
  },
  {
    name: varchar<100>('Settings'),
    code: varchar<50>('SETTINGS'),
    description: null,
    sortOrder: 9,
    isActive: true,
  },
] as const;

export async function seedPermissionGroups() {
  for (const group of permissionGroups) {
    await db.orm.public.PermissionGroup.upsert({
      create: group,
      update: {
        name: group.name,
        description: group.description,
        sortOrder: group.sortOrder,
        isActive: group.isActive,
      },
      conflictOn: {
        code: group.code,
      },
    });
  }

  console.log(
    `✅ Permission Groups seeded: ${permissionGroups.length}`,
  );
}