import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

const services = [
  DatabaseService
]

@Global()
@Module({
  providers: services,
  exports: services
})
export class CommonModule {}
