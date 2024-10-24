import { Global, Module } from '@nestjs/common';
import { UsersService } from './users';
import { TokensService } from './tokens/tokens.service';
import { AppsService } from './apps/apps.service';

const services = [
    UsersService,
    TokensService,
    AppsService
]

@Global()
@Module({
    providers: services,
    exports: services
})
export class ModelsModule {}
