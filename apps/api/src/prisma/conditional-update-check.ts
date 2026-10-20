
import { Temporal } from '@js-temporal/polyfill';
import { db } from './db.js';

async function checkConditionalUpdate() {
  await db.transaction(async (tx) => {
    const now = Temporal.Now.instant();

    const result = await tx.orm.public.PasswordReset
      .where({ usedAt: null })
      .where({ revokedAt: null })
      .where(({ expiresAt }) => expiresAt.gt(now))
      .update({
        usedAt: now,
      });

    if (result) {
      const id: string = result.id;
      const userId: string = result.userId;
      return { id, userId };
    }

    return null;
  });
}
