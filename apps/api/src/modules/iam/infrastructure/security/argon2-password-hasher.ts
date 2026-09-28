import { Injectable } from '@nestjs/common';

import argon2 from 'argon2';
import { IPasswordHasher } from '../../application/services/password-hasher.service.js';



@Injectable()
export class Argon2PasswordHasher
  implements IPasswordHasher
{
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
    });
  }

  async compare(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return argon2.verify(
      passwordHash,
      password,
    );
  }
}