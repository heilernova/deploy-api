import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database';
import { OmitBy, PartialWithout } from 'src/types';

export const FRAMEWORK_LIST = ["NestJS", "Angular", "FastAPI"] as const;
export const RUNTIME_ENVIRONMENT_LIST = ["Node.js", "Python", "Python"] as const;
export const RUNNING_ON_LIST = ["PM2", "Docker", "LiteSpeed", "Apache"] as const;

export type Framework = typeof FRAMEWORK_LIST[number];
export type RunningOn = typeof RUNNING_ON_LIST[number];
export type RuntimeEnvironment = typeof RUNTIME_ENVIRONMENT_LIST[number];

export interface IApp {
    id: string;
    created_at: string;
    updated_at: string;
    deploy_at: string | null;
    domain: string;
    name: string;
    process_name: string;
    version: string;
    location: string;
    startup_file: string | null;
    framework: Framework | null;
    running_on: RunningOn | null;
    runtime_environment: RuntimeEnvironment | null;
    url: string | null;
    repository: { 
        type: "git",
        url: string
    } | null;
    env: { [key: string]: string }
    ignore: string[];
    observations: string | null;
}

export interface IAppCreate extends PartialWithout<OmitBy<IApp, "id" | "created_at" | "updated_at" | "deploy_at">, "domain" | "name" | "process_name" | "location"> {}

export interface IAppUpdate extends Partial<OmitBy<IApp, "id" | "created_at">> {}

@Injectable()
export class AppsService {
    constructor(private readonly _db: DatabaseService){}

    public async getAll(){
        let conn = await this._db.getConnection();
        let res = await conn.all("select * from apps");
        res = res.map(item => {
            if (item.repository){
                item.repository = JSON.parse(item.repository); 
            }
            item.env = JSON.parse(item.env);
            item.ignore = JSON.parse(item.ignore);
            return item;
        })
        conn.close();
        return res;
    }

    public async get(id: string){
        let conn = await this._db.getConnection();
        let res = await conn.get("select * from apps where id = ?", id);
        if (res.repository){
            res.repository = JSON.parse(res.repository); 
        }
        res.env = JSON.parse(res.env);
        res.ignore = JSON.parse(res.ignore);
        return res;
    }

    public async create(data: IAppCreate){
        
        let conn = (await this._db.getConnection());
        let sql: string = "INSERT INTO apps values";
        let params = {
            ":id": crypto.randomUUID(),
            ":created_at": new Date().toISOString(),
            ":update_at": new Date().toISOString(),
            ":deploy_at": null,
            ":domain": data.domain,
            ":name": data.name,
            ":process_name": data.process_name,
            ":version": null,
            ":location": data.location,
            ":startup_file": data.startup_file ?? null,
            ":framework": data.framework ?? null,
            ":running_on": data.running_on ?? null,
            ":runtime_environment": data.runtime_environment ?? null,
            ":url": data.url ?? null,
            ":repository": data.repository ?  JSON.stringify(data.repository) : null, 
            ":env": data.env ? JSON.stringify(data.env) : "{}",
            ":ignore": data.ignore ? JSON.stringify(data.ignore) :  "[]",
            ":observation": data.observations ?? null,
        }
        sql += `(${Object.keys(params).join(", ")})`;
        let result = await conn.run(sql, params);
        await conn.close();
        return params[':id'];
    }

    public async update(id: string, data: IAppUpdate){
        let values = {
            ":update_at": new Date().toISOString(),
            ":domain": data.domain,
            ":name": data.name,
            ":process_name": data.process_name,
            ":version": null,
            ":location": data.location,
            ":startup_file": data.startup_file,
            ":framework": data.framework,
            ":running_on": data.running_on,
            ":runtime_environment": data.runtime_environment,
            ":url": data.url,
            ":repository": data.repository ?  JSON.stringify(data.repository) : undefined, 
            ":env": data.env ? JSON.stringify(data.env) : undefined,
            ":ignore": data.ignore ? JSON.stringify(data.ignore) :  undefined,
            ":observation": data.observations ?? undefined,
        }

        
        let updateValues: string[] = [];
        let params: { [key: string]: any } = { ":id": id };

        Object.entries(values).forEach(value => {
            if (value[1] != undefined){
                updateValues.push(`${value[0].substring(1)} = ${value[0]}`);
                params[value[0]] = value[1];
            }
        })
        const conn = await this._db.getConnection();
        await conn.run(`update apps set ${updateValues.join(", ")} where id = :id`, params);
        await conn.close();
    }

    public async delete(id: string){
        let conn = (await this._db.getConnection());
        await conn.run("delete from apps where id = ?", [id]);
        await conn.close();
    }
}


