
import { Test, type TestingModule } from '@nestjs/testing';

import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { Role } from '../domain/entities/role.entity.js';



import { RoleService } from '../application/services/role.service.js';
import { IRoleRepository, ROLE_REPOSITORY } from '../infrastructure/persistence/repositories/role.repository.js';

describe('RoleService', () => {
  let service: RoleService;

  const roleRepository: jest.Mocked<IRoleRepository> = {
    findById: jest.fn<IRoleRepository['findById']>(),
    findAll: jest.fn<IRoleRepository['findAll']>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: ROLE_REPOSITORY,
          useValue: roleRepository,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should return a role by id', async () => {
    const role = Role.create({
      id: 'role-1',
      name: 'Tenant Owner',
      code: 'TENANT_OWNER',
      description: 'Owner of a tenant',
      isActive: true,
      createdAt: new Date('2026-01-01T10:00:00.000Z'),
      updatedAt: new Date('2026-01-02T10:00:00.000Z'),
    });

    roleRepository.findById.mockResolvedValue(role);

    const result = await service.findById('role-1');

    expect(roleRepository.findById).toHaveBeenCalledWith('role-1');
    expect(result).toBe(role);
  });

  it('should return null when the role does not exist', async () => {
    roleRepository.findById.mockResolvedValue(null);

    const result = await service.findById('missing-role');

    expect(roleRepository.findById).toHaveBeenCalledWith('missing-role');
    expect(result).toBeNull();
  });

  it('should return all roles', async () => {
    const roles = [
      Role.create({
        id: 'role-1',
        name: 'Tenant Owner',
        code: 'TENANT_OWNER',
        description: null,
        isActive: true,
        createdAt: new Date('2026-01-01T10:00:00.000Z'),
        updatedAt: new Date('2026-01-02T10:00:00.000Z'),
      }),
      Role.create({
        id: 'role-2',
        name: 'Tenant Admin',
        code: 'TENANT_ADMIN',
        description: null,
        isActive: true,
        createdAt: new Date('2026-01-01T10:00:00.000Z'),
        updatedAt: new Date('2026-01-02T10:00:00.000Z'),
      }),
    ];

    roleRepository.findAll.mockResolvedValue(roles);

    const result = await service.findAll();

    expect(roleRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(roles);
  });

  it('should return an empty array when there are no roles', async () => {
    roleRepository.findAll.mockResolvedValue([]);

    const result = await service.findAll();

    expect(roleRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});
