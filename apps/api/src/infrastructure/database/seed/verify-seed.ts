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
// Tenant Types
// ======================================================

const expectedTenantTypes = [
  varchar<30>('BUSINESS'),
  varchar<30>('AGENCY'),
  varchar<30>('ENTERPRISE'),
  varchar<30>('INDIVIDUAL'),
] as const;

const tenantTypes =
  await db.orm.public.TenantType
    .where({})
    .all();

console.log(
  `📦 Tenant Types: ${tenantTypes.length} / 4`,
);

if (tenantTypes.length !== 4) {
  failed = true;
  console.log('❌ Tenant Types count mismatch');
}

for (const code of expectedTenantTypes) {
  const tenantType =
    await db.orm.public.TenantType
      .where({ code })
      .first();

  if (!tenantType) {
    failed = true;
    console.log(`❌ Missing Tenant Type: ${code}`);
  }
}

  // ======================================================
  // Tenant Statuses
  // ======================================================

  const expectedTenantStatusCodes = [
    varchar<30>('PENDING'),
    varchar<30>('ACTIVE'),
    varchar<30>('SUSPENDED'),
    varchar<30>('DISABLED'),
    varchar<30>('ARCHIVED'),
  ] as const;

  const tenantStatuses =
    await db.orm.public.TenantStatus
      .where({})
      .all();

  console.log(
    `📦 Tenant Statuses: ${tenantStatuses.length} / 5`,
  );

  if (tenantStatuses.length !== 5) {
    failed = true;
    console.log(
      '❌ Tenant Statuses count mismatch',
    );
  }

  for (const code of expectedTenantStatusCodes) {
    const tenantStatus =
      await db.orm.public.TenantStatus
        .where({ code })
        .first();

    if (!tenantStatus) {
      failed = true;
      console.log(
        `❌ Missing Tenant Status: ${code}`,
      );
    }
  }

   // ======================================================
  // WorkspaceType
  // ======================================================

  const expectedWorkspaceTypeCodes = [
  varchar<30>('MARKETING'),
  varchar<30>('SALES'),
  varchar<30>('SUPPORT'),
  varchar<30>('GENERAL'),
] as const;

const workspaceTypes = await db.orm.public.WorkspaceType.where({}).all();

console.log(`📦 Workspace Types: ${workspaceTypes.length} / 4`);

if (workspaceTypes.length !== 4) {
  failed = true;
  console.log('❌ Workspace Types count mismatch');
}

for (const code of expectedWorkspaceTypeCodes) {
  const workspaceType = await db.orm.public.WorkspaceType.where({ code }).first();

  if (!workspaceType) {
    failed = true;
    console.log(`❌ Missing Workspace Type: ${code}`);
  }
}

   // ======================================================
  // WorkspaceStatus
  // ======================================================

const expectedWorkspaceStatusCodes = [
  varchar<30>('PENDING'),
  varchar<30>('ACTIVE'),
  varchar<30>('SUSPENDED'),
  varchar<30>('ARCHIVED'),
] as const;

const workspaceStatuses =
  await db.orm.public.WorkspaceStatus.where({}).all();

console.log(`📦 Workspace Statuses: ${workspaceStatuses.length} / 4`);

if (workspaceStatuses.length !== 4) {
  failed = true;
  console.log('❌ Workspace Statuses count mismatch');
}

for (const code of expectedWorkspaceStatusCodes) {
  const workspaceStatus =
    await db.orm.public.WorkspaceStatus.where({ code }).first();

  if (!workspaceStatus) {
    failed = true;
    console.log(`❌ Missing Workspace Status: ${code}`);
  }
}

const expectedRegionTypeCodes = [
  varchar<30>('COUNTRY'),
  varchar<30>('STATE'),
  varchar<30>('CITY'),
  varchar<30>('DISTRICT'),
] as const;

const regionTypes = await db.orm.public.RegionType.where({}).all();

console.log(`📦 Region Types: ${regionTypes.length} / 4`);

if (regionTypes.length !== 4) {
  failed = true;
  console.log('❌ Region Types count mismatch');
}

for (const code of expectedRegionTypeCodes) {
  const regionType = await db.orm.public.RegionType.where({ code }).first();

  if (!regionType) {
    failed = true;
    console.log(`❌ Missing Region Type: ${code}`);
  }
}

const expectedRegions = [
  { code: 'TR', typeCode: 'COUNTRY', parentCode: null },
  { code: 'SY', typeCode: 'COUNTRY', parentCode: null },
  { code: 'SA', typeCode: 'COUNTRY', parentCode: null },

  { code: 'TR-34', typeCode: 'CITY', parentCode: 'TR' },
  { code: 'SY-DI', typeCode: 'CITY', parentCode: 'SY' },
  { code: 'SA-01', typeCode: 'CITY', parentCode: 'SA' },

  { code: 'TR-34-AVC', typeCode: 'DISTRICT', parentCode: 'TR-34' },
  { code: 'SY-DI-MEZ', typeCode: 'DISTRICT', parentCode: 'SY-DI' },
  { code: 'SA-01-OLY', typeCode: 'DISTRICT', parentCode: 'SA-01' },
] as const;

const regions = await db.orm.public.Region.where({}).all();

console.log(`📦 Regions: ${regions.length} / 9`);

if (regions.length !== expectedRegions.length) {
  failed = true;
  console.log('❌ Regions count mismatch');
}

for (const expected of expectedRegions) {
  const region = await db.orm.public.Region
    .where({ code: varchar<20>(expected.code) })
    .first();

  if (!region) {
    failed = true;
    console.log(`❌ Missing Region: ${expected.code}`);
    continue;
  }

  const regionType = await db.orm.public.RegionType
    .where({ id: region.regionTypeId })
    .first();

  if (regionType?.code !== expected.typeCode) {
    failed = true;
    console.log(`❌ Wrong RegionType for: ${expected.code}`);
  }

  if (expected.parentCode === null) {
    if (region.parentRegionId !== null) {
      failed = true;
      console.log(`❌ Expected no parent for: ${expected.code}`);
    }
  } else {
    const parent = await db.orm.public.Region
      .where({ id: region.parentRegionId! })
      .first();

    if (parent?.code !== expected.parentCode) {
      failed = true;
      console.log(`❌ Wrong parent for: ${expected.code}`);
    }
  }
}


const expectedTimezones = [
  { ianaName: varchar<100>('Europe/Istanbul'), regionCode: 'TR-34' },
  { ianaName: varchar<100>('Asia/Damascus'), regionCode: 'SY-DI' },
  { ianaName: varchar<100>('Asia/Riyadh'), regionCode: 'SA-01' },
] as const;

const timezones = await db.orm.public.Timezone.where({}).all();

console.log(`📦 Timezones: ${timezones.length} / 3`);

if (timezones.length !== expectedTimezones.length) {
  failed = true;
  console.log('❌ Timezones count mismatch');
}

for (const expected of expectedTimezones) {
  const timezone = await db.orm.public.Timezone
    .where({ ianaName: expected.ianaName })
    .first();

  if (!timezone) {
    failed = true;
    console.log(`❌ Missing Timezone: ${expected.ianaName}`);
    continue;
  }

  const region = await db.orm.public.Region
    .where({ id: timezone.regionId! })
    .first();

  if (region?.code !== expected.regionCode) {
    failed = true;
    console.log(`❌ Wrong Region for Timezone: ${expected.ianaName}`);
  }
}


const expectedCurrencies = [
  {
    code: varchar<3>('TRY'),
    numericCode: 949,
    decimalPlaces: 2,
  },
  {
    code: varchar<3>('SYP'),
    numericCode: 760,
    decimalPlaces: 2,
  },
  {
    code: varchar<3>('SAR'),
    numericCode: 682,
    decimalPlaces: 2,
  },
  {
    code: varchar<3>('USD'),
    numericCode: 840,
    decimalPlaces: 2,
  },
] as const;

const currencies = await db.orm.public.Currency.where({}).all();

console.log(`📦 Currencies: ${currencies.length} / 4`);

if (currencies.length !== expectedCurrencies.length) {
  failed = true;
  console.log('❌ Currencies count mismatch');
}

for (const expected of expectedCurrencies) {
  const currency = await db.orm.public.Currency
    .where({ code: expected.code })
    .first();

  if (!currency) {
    failed = true;
    console.log(`❌ Missing Currency: ${expected.code}`);
    continue;
  }

  if (
    currency.numericCode !== expected.numericCode ||
    currency.decimalPlaces !== expected.decimalPlaces
  ) {
    failed = true;
    console.log(`❌ Incorrect data for Currency: ${expected.code}`);
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