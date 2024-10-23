import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ControllersModule } from './controllers/controllers.module';
import { ModelsModule } from './models/models.module';

@Module({
  imports: [CommonModule, ControllersModule, ModelsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
