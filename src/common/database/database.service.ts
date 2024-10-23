import { Injectable } from '@nestjs/common';
import * as sqlite3 from 'sqlite3'
import { open } from 'sqlite'

@Injectable()
export class DatabaseService {
    constructor(){
        this.init();
    }

    private async init(){
        const db = await open({
            filename: './app.db',
            driver: sqlite3.Database
        })
    }

    public async getConnection(){
        const db = await open({
            filename: './app.db',
            driver: sqlite3.Database
        })
        return db;
    }
}
