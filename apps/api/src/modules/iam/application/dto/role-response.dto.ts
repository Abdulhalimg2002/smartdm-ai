
import { Role } from '../../domain/entities/role.entity.js';

export class RoleResponseDto {
  id!: string;
  name!: string;
  code!: string;
  description!: string | null;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      code: role.code,
      description: role.description,
      isActive: role.isActive,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  static fromEntities(roles: Role[]): RoleResponseDto[] {
    return roles.map((role) => this.fromEntity(role));
  }
}
