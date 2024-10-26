import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { Pm2Service } from './pm2/pm2.service';

const services = [
  DatabaseService,
  Pm2Service
]

@Global()
@Module({
  providers: services,
  exports: services
})
export class CommonModule {}
