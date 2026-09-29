import { Injectable } from '@nestjs/common';
import {
  createHash,
  randomBytes,
} from 'node:crypto';

import type {
  ISessionTokenService,
} from '../../application/services/session-token.service.js';

@Injectable()
export class SessionTokenService
  implements ISessionTokenService
{
  generate(): string {
    return randomBytes(32).toString('hex');
  }

  hash(token: string): string {
    return createHash('sha256')
      .update(token)
      .digest('hex');
  }
}