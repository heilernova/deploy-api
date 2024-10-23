import { Global, Module } from '@nestjs/common';
import { UsersService } from './users';

const services = [
    UsersService
]

@Global()
@Module({
    providers: services,
    exports: services
})
export class ModelsModule {}
