
import { Temporal } from '@js-temporal/polyfill';

import { Role } from '../../../domain/entities/role.entity.js';


import { db } from '../../../../../prisma/db.js';
import { IRoleRepository } from './role.repository.js';

const toDate = (value: Date | Temporal.Instant): Date => {
  if (value instanceof Date) {
    return value;
  }

  return new Date(value.epochMilliseconds);
};

export class PrismaRoleRepository implements IRoleRepository {
  async findById(id: string): Promise<Role | null> {
    const record = await db.orm.public.Role.where({ id }).first();

    if (!record) {
      return null;
    }

    return Role.create({
      id: record.id,
      name: record.name,
      code: record.code,
      description: record.description,
      isActive: record.isActive,
      createdAt: toDate(record.createdAt),
      updatedAt: toDate(record.updatedAt),
    });
  }

  async findAll(): Promise<Role[]> {
    const records = await db.orm.public.Role.where({}).all();

    return records.map((record) =>
      Role.create({
        id: record.id,
        name: record.name,
        code: record.code,
        description: record.description,
        isActive: record.isActive,
        createdAt: toDate(record.createdAt),
        updatedAt: toDate(record.updatedAt),
      }),
    );
  }
}
