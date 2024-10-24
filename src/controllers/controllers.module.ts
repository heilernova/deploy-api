import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AppsController } from './apps/apps.controller';

@Module({
  controllers: [AuthController, AppsController]
})
export class ControllersModule {}
