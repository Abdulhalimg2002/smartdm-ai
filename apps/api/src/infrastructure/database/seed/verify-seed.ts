import { db } from '../../../prisma/db.js';

type Varchar<N extends number> = string & {
  readonly __varcharLength: N;
};

const varchar = <N extends number>(value: string) =>
  value as Varchar<N>;

async function verifySeed() {
  console.log('🔍 SmartDM final seed verification started\n');

  let failed = false;

  // ======================================================
  // 1. Permission Groups
  // ======================================================

  const expectedGroupCodes = [
    varchar<50>('USERS'),
    varchar<50>('INVITATIONS'),
    varchar<50>('CRM'),
    varchar<50>('SOCIAL_INBOX'),
    varchar<50>('AUTOMATION'),
    varchar<50>('AI'),
    varchar<50>('SETTINGS'),
  ] as const;

  const permissionGroups =
    await db.orm.public.PermissionGroup
      .where({})
      .all();

  console.log(
    `📦 Permission Groups: ${permissionGroups.length} / 7`,
  );

  if (permissionGroups.length !== 7) {
    failed = true;
    console.log('❌ Permission Groups count mismatch');
  }

  for (const code of expectedGroupCodes) {
    const group =
      await db.orm.public.PermissionGroup
        .where({ code })
        .first();

    if (!group) {
      failed = true;
      console.log(`❌ Missing Permission Group: ${code}`);
    }
  }

  // ======================================================
  // 2. Permissions
  // ======================================================

  const expectedPermissionCodes = [
    varchar<100>('users.read'),
    varchar<100>('users.create'),
    varchar<100>('users.update'),
    varchar<100>('users.delete'),
    varchar<100>('invitations.create'),
  ] as const;

  const permissions =
    await db.orm.public.Permission
      .where({})
      .all();

  console.log(
    `📦 Permissions: ${permissions.length} / 5`,
  );

  if (permissions.length !== 5) {
    failed = true;
    console.log('❌ Permissions count mismatch');
  }

  for (const code of expectedPermissionCodes) {
    const permission =
      await db.orm.public.Permission
        .where({ code })
        .first();

    if (!permission) {
      failed = true;
      console.log(`❌ Missing Permission: ${code}`);
    }
  }

  // ======================================================
  // 3. Permission → Group Relationships
  // ======================================================

  const usersGroup =
    await db.orm.public.PermissionGroup
      .where({
        code: varchar<50>('USERS'),
      })
      .first();

  const invitationsGroup =
    await db.orm.public.PermissionGroup
      .where({
        code: varchar<50>('INVITATIONS'),
      })
      .first();

  if (!usersGroup || !invitationsGroup) {
    failed = true;
    console.log(
      '❌ Required Permission Groups not found',
    );
  } else {
    const userPermissions =
      await db.orm.public.Permission
        .where({
          permissionGroupId: usersGroup.id,
        })
        .all();

    const invitationPermissions =
      await db.orm.public.Permission
        .where({
          permissionGroupId: invitationsGroup.id,
        })
        .all();

    console.log(
      `🔗 USERS permissions: ${userPermissions.length} / 4`,
    );

    console.log(
      `🔗 INVITATIONS permissions: ${invitationPermissions.length} / 1`,
    );

    if (userPermissions.length !== 4) {
      failed = true;
      console.log(
        '❌ USERS permission relationship mismatch',
      );
    }

    if (invitationPermissions.length !== 1) {
      failed = true;
      console.log(
        '❌ INVITATIONS permission relationship mismatch',
      );
    }
  }

  // ======================================================
  // 4. Roles
  // ======================================================

  const expectedRoleCodes = [
    varchar<50>('TENANT_OWNER'),
    varchar<50>('TENANT_ADMIN'),
    varchar<50>('MEMBER'),
  ] as const;

  const roles =
    await db.orm.public.Role
      .where({})
      .all();

  console.log(
    `📦 Roles: ${roles.length} / 3`,
  );

  if (roles.length !== 3) {
    failed = true;
    console.log('❌ Roles count mismatch');
  }

  for (const code of expectedRoleCodes) {
    const role =
      await db.orm.public.Role
        .where({ code })
        .first();

    if (!role) {
      failed = true;
      console.log(`❌ Missing Role: ${code}`);
    }
  }

  // ======================================================
  // 5. Role Permissions
  // ======================================================

  const rolePermissions =
    await db.orm.public.RolePermission
      .where({})
      .all();

  console.log(
    `📦 Role Permissions: ${rolePermissions.length} / 10`,
  );

  if (rolePermissions.length !== 10) {
    failed = true;
    console.log(
      '❌ Role Permissions count mismatch',
    );
  }

  // ======================================================
  // 6. Scope Types
  // ======================================================

  const expectedScopeCodes = [
    varchar<30>('TENANT'),
    varchar<30>('WORKSPACE'),
  ] as const;

  const scopeTypes =
    await db.orm.public.ScopeType
      .where({})
      .all();

  console.log(
    `📦 Scope Types: ${scopeTypes.length} / 2`,
  );

  if (scopeTypes.length !== 2) {
    failed = true;
    console.log('❌ Scope Types count mismatch');
  }

  for (const code of expectedScopeCodes) {
    const scopeType =
      await db.orm.public.ScopeType
        .where({ code })
        .first();

    if (!scopeType) {
      failed = true;
      console.log(`❌ Missing Scope Type: ${code}`);
    }
  }

  // ======================================================
  // 7. Auth Providers
  // ======================================================

  const expectedProviderCodes = [
    varchar<50>('LOCAL'),
    varchar<50>('GOOGLE'),
  ] as const;

  const authProviders =
    await db.orm.public.AuthProvider
      .where({})
      .all();

  console.log(
    `📦 Auth Providers: ${authProviders.length} / 2`,
  );

  if (authProviders.length !== 2) {
    failed = true;
    console.log(
      '❌ Auth Providers count mismatch',
    );
  }

  for (const code of expectedProviderCodes) {
    const provider =
      await db.orm.public.AuthProvider
        .where({ code })
        .first();

    if (!provider) {
      failed = true;
      console.log(`❌ Missing Auth Provider: ${code}`);
    }
  }

  // ======================================================
  // 8. Auth Event Types
  // ======================================================

  const expectedAuthEventCodes = [
    varchar<50>('REGISTER'),
    varchar<50>('LOGIN'),
    varchar<50>('LOGOUT'),
    varchar<50>('LOGIN_FAILED'),
    varchar<50>('PASSWORD_CHANGED'),
    varchar<50>('PASSWORD_RESET_REQUESTED'),
    varchar<50>('PASSWORD_RESET_COMPLETED'),
    varchar<50>('EMAIL_VERIFIED'),
  ] as const;

  const authEventTypes =
    await db.orm.public.AuthEventType
      .where({})
      .all();

  console.log(
    `📦 Auth Event Types: ${authEventTypes.length} / 8`,
  );

  if (authEventTypes.length !== 8) {
    failed = true;
    console.log(
      '❌ Auth Event Types count mismatch',
    );
  }

  for (const code of expectedAuthEventCodes) {
    const eventType =
      await db.orm.public.AuthEventType
        .where({ code })
        .first();

    if (!eventType) {
      failed = true;
      console.log(
        `❌ Missing Auth Event Type: ${code}`,
      );
    }
  }

  // ======================================================
  // Final Result
  // ======================================================

  console.log('\n----------------------------------------');

  if (failed) {
    console.log('❌ SmartDM seed verification FAILED');
    process.exitCode = 1;
    return;
  }

  console.log(
    '✅ SmartDM seed verification PASSED',
  );
}

verifySeed().catch((error) => {
  console.error(
    '❌ Seed verification failed:',
    error,
  );

  process.exitCode = 1;
});