
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';

import { RoleService } from '../../application/services/role.service.js';
import { RoleResponseDto } from '../../application/dto/role-response.dto.js';


@Controller('roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @Get()
  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleService.findAll();

    return RoleResponseDto.fromEntities(roles);
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<RoleResponseDto> {
    const role = await this.roleService.findById(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return RoleResponseDto.fromEntity(role);
  }
}
