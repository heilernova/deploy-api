import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from '@nestjs/common';
import { AppsService } from 'src/models/apps';

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
    async create(){
        let id: string = await this._apps.create({ 
            domain: "www.lacasaimperial.com",
            name: "API",
            location: "/home/",
            process_name: "la_casa_imperial_api"
        });
        
        return this._apps.get(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any){
        // return body;
        await this._apps.update(id, body);
    }


    @Delete(':id')
    async delete(@Param('id') id: string){
        await this._apps.delete(id);
    }
}
