import { db } from '../../../prisma/db.js';
import { PrismaUserAuthProviderRepository } from '../infrastructure/persistence/repositories/prisma-user-auth-provider.repository.js';
import { UserAuthProvider } from '../domain/entities/user-auth-provider.entity.js';
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
 
} from '@jest/globals';
type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;
describe('UserAuthProvider Repository Integration', () => {
  const repository =
    new PrismaUserAuthProviderRepository();

  let userId: string;
  let authProviderId: string;

  beforeAll(async () => {
  const user = await db.orm.public.User.create({
    id: crypto.randomUUID(),
    email: varchar<255>(
      `user-auth-provider-${crypto.randomUUID()}@test.com`,
    ),
    firstName: varchar<100>('Test'),
    lastName: varchar<100>('User'),
  });

  const provider =
    await db.orm.public.AuthProvider
      .where({
        code: varchar<50>('GOOGLE'),
      })
      .first();

  if (!provider) {
    throw new Error(
      'GOOGLE AuthProvider not found. Run seed first.',
    );
  }

  userId = user.id;
  authProviderId = provider.id;
});

  afterAll(async () => {
    await db.orm.public.UserAuthProvider
      .where({
        userId,
      })
      .delete();

    await db.orm.public.User
      .where({
        id: userId,
      })
      .delete();

    await db[Symbol.asyncDispose]();
  });

  it('should create and find a UserAuthProvider', async () => {
    const userAuthProvider =
      UserAuthProvider.createNew({
        id: crypto.randomUUID(),
        userId,
        authProviderId,
        providerUserId: `google-${crypto.randomUUID()}`,
        providerEmail: `google-${crypto.randomUUID()}@gmail.com`,
      });

    const created =
      await repository.create(
        userAuthProvider,
      );

    expect(created.id).toBe(
      userAuthProvider.id,
    );

    expect(created.userId).toBe(userId);

    expect(created.authProviderId).toBe(
      authProviderId,
    );

    expect(created.providerUserId).toBe(
      userAuthProvider.providerUserId,
    );

    const foundById =
      await repository.findById(
        created.id,
      );

    expect(foundById).not.toBeNull();

    expect(foundById?.id).toBe(
      created.id,
    );
  });

  it('should find by user and provider', async () => {
    const found =
      await repository.findByUserAndProvider(
        userId,
        authProviderId,
      );

    expect(found).not.toBeNull();

    expect(found?.userId).toBe(userId);

    expect(found?.authProviderId).toBe(
      authProviderId,
    );
  });

  it('should find by provider user id', async () => {
    const existing =
      await repository.findByUserAndProvider(
        userId,
        authProviderId,
      );

    expect(existing).not.toBeNull();

    const found =
      await repository.findByProviderUserId(
        authProviderId,
        existing!.providerUserId!,
      );

    expect(found).not.toBeNull();

    expect(found?.id).toBe(
      existing?.id,
    );
  });

  it('should update a UserAuthProvider', async () => {
    const existing =
      await repository.findByUserAndProvider(
        userId,
        authProviderId,
      );

    expect(existing).not.toBeNull();

    existing!.markUsed();

    const updated =
      await repository.update(
        existing!,
      );

    expect(updated.lastUsedAt).not.toBeNull();
  });
});