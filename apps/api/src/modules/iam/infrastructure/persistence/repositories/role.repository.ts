import { Role } from "../../../domain/entities/role.entity.js";



export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  findById(id: string): Promise<Role | null>;

  findAll(): Promise<Role[]>;
}
