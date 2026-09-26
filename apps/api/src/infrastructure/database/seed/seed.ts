import 'dotenv/config';
import { db } from '../../../prisma/db.js';
import { seedPermissionGroups } from './system/permission-groups.seed.js';
import { seedPermissions } from './system/permissions.seed.js';
import { seedRoles } from './system/roles.seed.js';
import { seedRolePermissions } from './system/role_permissions.seed.js';
import { seedScopeTypes } from './system/scope-types.seed.js';
import { seedAuthProviders } from './system/auth-providers.seed.js';
import { seedAuthEventTypes } from './system/auth-event-types.seed.js';



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
 
  
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db[Symbol.asyncDispose]();
  });