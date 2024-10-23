import { Body, Controller, Get, Headers, HttpException, Ip, Post } from '@nestjs/common';
import { DatabaseService } from 'src/common/database';
import { UsersService } from 'src/models/users';
import { CredentialsDto } from './dto/credentials.dto';
import * as bcrypt from 'bcrypt';
import { TokensService } from 'src/models/tokens';

@Controller()
export class AuthController {
    constructor(
        private readonly _db: DatabaseService,
        private readonly _users: UsersService,
        private readonly _tokens: TokensService
    ){}

    @Post('sign-in')
    public async signIn(@Body() credentials: CredentialsDto, @Headers() headers: any, @Ip() ip: string){
        let res = await this._users.get(credentials.username);
        if (!res){
            throw new HttpException("Usuario no encontrad", 400);
        }

        if (!bcrypt.compareSync(credentials.password, res.password)){
            throw new HttpException("Tu contraseña es incorrecta", 400);
        }

        let token = await this._tokens.create({ 
            userId: res.id,
            device: "desktop",
            ip: ip,
            hostname: "",
            type: "web"
        });

        return {
            name: res.name,
            role: res.role,
            token
        }
    }

    @Get()
    public async verifySession(){

    }
}
