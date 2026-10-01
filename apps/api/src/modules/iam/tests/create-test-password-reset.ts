import 'dotenv/config';
import 'temporal-polyfill/full/global';

import { db } from '../../../prisma/db.js';

const varchar = <N extends number>(
  value: string,
) =>
  value as string & {
    readonly __varcharLength: N;
  };

const tokenHash =
  '8a74f42e4c14bd1c5567a149d7c9e23ec04eeac5714f453b84539978f15ba451';

try {
  const passwordReset =
    await db.orm.public.PasswordReset
      .where({
        tokenHash:
          varchar<255>(
            tokenHash,
          ),
      })
      .first();

  if (!passwordReset) {
    throw new Error(
      'PasswordReset test record was not found.',
    );
  }

  console.log(
    'PasswordReset test record found:',
  );

  console.log({
    id: passwordReset.id,
    userId: passwordReset.userId,
    tokenHash:
      passwordReset.tokenHash,
    expiresAt:
      passwordReset.expiresAt,
    usedAt:
      passwordReset.usedAt,
    revokedAt:
      passwordReset.revokedAt,
  });
} finally {
  await db[Symbol.asyncDispose]();
}