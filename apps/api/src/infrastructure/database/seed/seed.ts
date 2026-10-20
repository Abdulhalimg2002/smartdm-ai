import 'dotenv/config';
import { db } from '../../../prisma/db.js';
import { seedPermissionGroups } from './system/permission-groups.seed.js';
import { seedPermissions } from './system/permissions.seed.js';
import { seedRoles } from './system/roles.seed.js';
import { seedRolePermissions } from './system/role_permissions.seed.js';
import { seedScopeTypes } from './system/scope-types.seed.js';
import { seedAuthProviders } from './system/auth-providers.seed.js';
import { seedAuthEventTypes } from './system/auth-event-types.seed.js';
import { seedTenantTypes } from './tenant/tenant-types.seed.js';
import { seedTenantStatuses } from './tenant/tenant-statuses.seed.js';
import { seedWorkspaceTypes } from './tenant/workspace-types.seed.js';
import { seedWorkspaceStatuses } from './tenant/workspace-statuses.seed.js';
import { seedRegionTypes } from './REFERENCE DATA/region-types.seed.js';
import { seedRegions } from './REFERENCE DATA/regions.seed.js';
import { seedTimezones } from './REFERENCE DATA/timezones.seed.js';
import { seedCurrencies } from './REFERENCE DATA/currencies.seed.js';



async function main() {
  await db.connect();

  console.log('🌱 SmartDM system seed started');

  await seedPermissionGroups();
  await seedPermissions();
  await seedRoles();
  await seedRolePermissions();
  await seedScopeTypes();
  await seedAuthProviders();
  await seedAuthEventTypes();
  
 
  console.log('✅ SmartDM system seed completed');
 console.log('🌱 SmartDM tenant seed started');
await seedTenantTypes();
await seedTenantStatuses();
await seedWorkspaceTypes();
await seedWorkspaceStatuses();
console.log('✅ SmartDM tenant seed completed');

console.log('✅ SmartDM REFERENCE DATA  seed started');
await seedRegionTypes();
await seedRegions();
await seedTimezones();
await seedCurrencies();
console.log('✅ SmartDM REFERENCE DATA seed completed');
  
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db[Symbol.asyncDispose]();
  });