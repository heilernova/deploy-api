import { Injectable } from '@nestjs/common';
import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

@Injectable()
export class DatabaseService {
    private _con: Database<sqlite3.Database, sqlite3.Statement> | null = null;
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
        if (this._con){
            return this._con;
        }

        const db = await open({
            filename: './app.db',
            driver: sqlite3.Database
        })

        this._con = db;
        return db;
    }
}
