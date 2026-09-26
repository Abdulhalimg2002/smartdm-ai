import { db } from '../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

async function cleanupLegacyGroups() {
  console.log('🧹 Legacy Permission Groups cleanup started');

  const legacyCodes = [
    varchar<50>('ANALYTICS'),
    varchar<50>('BILLING'),
    varchar<50>('NOTIFICATIONS'),
  ] as const;

  for (const code of legacyCodes) {
    const group =
      await db.orm.public.PermissionGroup
        .where({ code })
        .first();

    if (!group) {
      console.log(`ℹ️ ${code} not found`);
      continue;
    }

    const permissions =
      await db.orm.public.Permission
        .where({
          permissionGroupId: group.id,
        })
        .all();

    if (permissions.length > 0) {
      throw new Error(
        `Cannot delete ${code}: it has ${permissions.length} permissions`,
      );
    }

    await db.orm.public.PermissionGroup
      .where({
        id: group.id,
      })
      .delete();

    console.log(`🗑️ Deleted: ${code}`);
  }

  console.log(
    '✅ Legacy Permission Groups cleanup completed',
  );
}

cleanupLegacyGroups()
  .catch((error) => {
    console.error(
      '❌ Legacy cleanup failed:',
      error,
    );

    process.exitCode = 1;
  });