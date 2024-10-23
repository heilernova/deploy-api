import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private _db: DatabaseService){}

    async getAll(): Promise<IUser[]>{
        const con = await this._db.getConnection();
        let res = con.all("select * from users");
        con.close();
        return res;
    }

    async get(value: string){
        const con = await this._db.getConnection();
        let res = await con.get(`select * from users where id = ?`, [value]);
        con.close();
        return res;
    }

    async create(data: { role: "admin" | "collaborator", name: string, email: string, password: string }){
        const con = await this._db.getConnection();
        let values: IUser = {
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: data.role,
            name: data.name,
            email: data.email.toLowerCase(),
            password: bcrypt.hashSync(data.password, 15)
        }

        await con.run("insert into users values(?, ?, ?, ?, ?, ?, ?)", values);
        con.close();
        return values;
    }

    async update(id: string, values: IUserUpdate){
        let params: any[] = [];
        let v: string[] = ["update_at = ?"];
        params.push(new Date().toISOString());

        Object.entries(values).forEach(entry => {
            if (entry[0] == "password"){
                entry[1] =  bcrypt.hashSync("admin", 15)
            }

            if (entry[0] == "email"){
                entry[1] = (entry[1] as string).toLowerCase();
            }

            v.push(`${entry[0]} = ?`);
            params.push(entry[1]);
        })
    }

    async delete(id: string){
        const con = await this._db.getConnection();
        await con.run("delete from users where id = ?", [id]);
    }
}

export interface IUser {
    id: string;
    created_at: string;
    updated_at: string;
    role: "admin" | "collaborator";
    name: string;
    email: string;
    password: string;
}
export interface IUserUpdate  {
    updated_at?: string;
    role?: string;
    name?: string;
    email?: "admin" | "collaborator";
    password?: string;
}
