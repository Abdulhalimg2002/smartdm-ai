import { db } from '../../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

const authProviders = [
  {
    name: varchar<100>('Local'),
    code: varchar<50>('LOCAL'),
    description: 'Email + Password',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: varchar<100>('Google'),
    code: varchar<50>('GOOGLE'),
    description: 'Google OAuth',
    sortOrder: 2,
    isActive: true,
  },
 
 
] as const;

export async function seedAuthProviders() {
  for (const provider of authProviders) {
    await db.orm.public.AuthProvider.upsert({
      create: provider,
      update: {
        name: provider.name,
        description: provider.description,
        sortOrder: provider.sortOrder,
        isActive: provider.isActive,
      },
      conflictOn: {
        code: provider.code,
      },
    });
  }

  console.log(
    `✅ Auth Providers seeded: ${authProviders.length}`,
  );
}