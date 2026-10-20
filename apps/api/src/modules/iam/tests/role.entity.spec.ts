
import {
  describe,
  expect,
  it,
} from '@jest/globals';
import { Role, RoleProps } from '../domain/entities/role.entity.js';


describe('Role', () => {
  const createRoleProps = (
    overrides: Partial<RoleProps> = {},
  ): RoleProps => ({
    id: 'role-1',
    name: 'Tenant Owner',
    code: 'TENANT_OWNER',
    description: 'Owner of a tenant',
    isActive: true,
    createdAt: new Date('2026-01-01T10:00:00.000Z'),
    updatedAt: new Date('2026-01-02T10:00:00.000Z'),
    ...overrides,
  });

  describe('create', () => {
    it('should create a Role instance with the provided properties', () => {
      const props = createRoleProps();

      const role = Role.create(props);

      expect(role).toBeInstanceOf(Role);
      expect(role.id).toBe(props.id);
      expect(role.name).toBe(props.name);
      expect(role.code).toBe(props.code);
    });
  });

  describe('getters', () => {
    it('should return all role properties', () => {
      const props = createRoleProps();
      const role = Role.create(props);

      expect(role.id).toBe('role-1');
      expect(role.name).toBe('Tenant Owner');
      expect(role.code).toBe('TENANT_OWNER');
      expect(role.description).toBe('Owner of a tenant');
      expect(role.isActive).toBe(true);
      expect(role.createdAt).toBe(props.createdAt);
      expect(role.updatedAt).toBe(props.updatedAt);
    });

    it('should support a null description', () => {
      const role = Role.create(
        createRoleProps({ description: null }),
      );

      expect(role.description).toBeNull();
    });

    it('should represent an inactive role', () => {
      const role = Role.create(
        createRoleProps({ isActive: false }),
      );

      expect(role.isActive).toBe(false);
    });
  });
});
