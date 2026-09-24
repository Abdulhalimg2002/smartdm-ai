import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { db } from '../../../prisma/db.js';


@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly db = db;

  async onModuleInit() {
    await this.db.connect();
      console.log('✅ Database connected successfully');
  }

  async onModuleDestroy() {
    await this.db[Symbol.asyncDispose]();
  }
}