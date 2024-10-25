import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from '@nestjs/common';
import { AppsService } from 'src/models/apps';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';

@Controller('apps')
export class AppsController {
    constructor(
        private readonly _apps: AppsService
    ){}

    @Get()
    async getAll(){
        return this._apps.getAll();
    }

    @Post()
    async create(@Body() body: CreateAppDto){
        if (body.domain.startsWith("www")){
            body.domain = body.domain.substring(4);
        }
        if (await this._apps.nameInUse(body.domain, body.name)){
            throw new HttpException("El dominio y el nombre ya se encuentra en uso", 400);
        }
        if (await this._apps.processNameInUse(body.process_name)){
            throw new HttpException("El nombre del proceso ya se cuenta en uso", 400);
        }
        let id: string = await this._apps.create(body);
        return this._apps.get(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateAppDto){
        let app = await this._apps.get(id);
        if (!app) throw new HttpException("Aplicación no registrada", 404);
        if (body.domain && body.domain.startsWith("www")){
            body.domain = body.domain.substring(4);
        }
        body.domain = body.domain ?? app.domain;
        body.name = body.name ?? app.name;
        body.process_name = body.process_name ?? app.process_name;
        if (body.domain &&  body.name && await this._apps.nameInUse(body.domain, body.name)){
            throw new HttpException("El dominio y el nombre ya se encuentra en uso", 400);
        }
        if (body.process_name && await this._apps.processNameInUse(body.process_name)){
            throw new HttpException("El nombre del proceso ya se cuenta en uso", 400);
        }
        await this._apps.update(id, body);
    }


    @Delete(':id')
    async delete(@Param('id') id: string){
        await this._apps.delete(id);
    }
}
