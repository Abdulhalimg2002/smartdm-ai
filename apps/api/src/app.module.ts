import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { IAMModule } from './modules/iam/iam.module.js';



@Module({
  imports: [PrismaModule,IAMModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
