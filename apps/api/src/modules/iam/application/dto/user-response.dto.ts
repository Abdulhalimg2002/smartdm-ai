
import { User } from '../../domain/entities/user.entity.js';

export class UserResponseDto {
  id!: string;
  email!: string;
  firstName!: string | null;
  lastName!: string | null;
  status!: string;
  emailVerifiedAt!: Date | null;
  lastLoginAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(
    user: User,
  ): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      emailVerifiedAt:
        user.emailVerifiedAt,
      lastLoginAt:
        user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

