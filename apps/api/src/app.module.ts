import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { IamModule } from './modules/iam/iam.module.js';




@Module({
  imports: [PrismaModule,IamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
