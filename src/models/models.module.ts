import { Global, Module } from '@nestjs/common';
import { UsersService } from './users';
import { TokensService } from './tokens/tokens.service';

const services = [
    UsersService,
    TokensService
]

@Global()
@Module({
    providers: services,
    exports: services
})
export class ModelsModule {}
