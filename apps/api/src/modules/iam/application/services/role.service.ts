
import { Inject, Injectable } from '@nestjs/common';



import { Role } from '../../domain/entities/role.entity.js';
import { type IRoleRepository, ROLE_REPOSITORY } from '../../infrastructure/persistence/repositories/role.repository.js';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async findById(id: string): Promise<Role | null> {
    return this.roleRepository.findById(id);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }
}
