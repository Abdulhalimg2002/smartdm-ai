import { BadRequestException } from '@nestjs/common';

export class InvalidPasswordResetError
  extends BadRequestException
{
  constructor() {
    super('Invalid password reset token');
    this.name = 'InvalidPasswordResetError';
  }
}