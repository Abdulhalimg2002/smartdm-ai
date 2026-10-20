

import { Role } from '../domain/entities/role.entity.js';
import {
  describe,
  expect,
  it,
  beforeEach, jest
} from '@jest/globals';

type RoleRecord = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const mockFirst = jest.fn(
  async (): Promise<RoleRecord | null> => null,
);

const mockAll = jest.fn(
  async (): Promise<RoleRecord[]> => [],
);

const mockWhere = jest.fn((_filter: { id?: string }) => ({
  first: mockFirst,
  all: mockAll,
}));

jest.unstable_mockModule('../../../prisma/db.js', () => ({
  db: {
    orm: {
      public: {
        Role: {
          where: mockWhere,
        },
      },
    },
  },
}));

const { PrismaRoleRepository } = await import(
  '../infrastructure/persistence/repositories/prisma-role.repository.js'
);

const createRoleRecord = (
  overrides: Partial<RoleRecord> = {},
): RoleRecord => ({
  id: 'role-1',
  name: 'Tenant Owner',
  code: 'TENANT_OWNER',
  description: 'Owner of a tenant',
  isActive: true,
  createdAt: new Date('2026-01-01T10:00:00.000Z'),
  updatedAt: new Date('2026-01-02T10:00:00.000Z'),
  ...overrides,
});

describe('PrismaRoleRepository', () => {
  let repository: InstanceType<typeof PrismaRoleRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaRoleRepository();
  });

  describe('findById', () => {
    it('should return a Role when the record exists', async () => {
      const record = createRoleRecord();
      mockFirst.mockResolvedValue(record);

      const result = await repository.findById('role-1');

      expect(mockWhere).toHaveBeenCalledWith({ id: 'role-1' });
      expect(mockFirst).toHaveBeenCalledTimes(1);

      expect(result).toBeInstanceOf(Role);
      expect(result?.id).toBe(record.id);
      expect(result?.name).toBe(record.name);
      expect(result?.code).toBe(record.code);
      expect(result?.description).toBe(record.description);
      expect(result?.isActive).toBe(record.isActive);
      expect(result?.createdAt).toBe(record.createdAt);
      expect(result?.updatedAt).toBe(record.updatedAt);
    });

    it('should return null when the record does not exist', async () => {
      mockFirst.mockResolvedValue(null);

      const result = await repository.findById('missing-role');

      expect(result).toBeNull();
      expect(mockWhere).toHaveBeenCalledWith({
        id: 'missing-role',
      });
    });
  });

  describe('findAll', () => {
    it('should return all records as Role entities', async () => {
      const records = [
        createRoleRecord(),
        createRoleRecord({
          id: 'role-2',
          name: 'Member',
          code: 'MEMBER',
          description: null,
        }),
      ];

      mockAll.mockResolvedValue(records);

      const result = await repository.findAll();

      expect(mockWhere).toHaveBeenCalledWith({});
      expect(mockAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);

      expect(result[0]).toBeInstanceOf(Role);
      expect(result[0].code).toBe('TENANT_OWNER');

      expect(result[1]).toBeInstanceOf(Role);
      expect(result[1].code).toBe('MEMBER');
      expect(result[1].description).toBeNull();
    });

    it('should return an empty array when no records exist', async () => {
      mockAll.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });
});
