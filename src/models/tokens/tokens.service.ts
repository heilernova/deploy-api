import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database';

@Injectable()
export class TokensService {
    constructor(
        private readonly _db: DatabaseService
    ){}

    async create(data: { userId: string, type: "web" | "cli", hostname: string, ip: string, device: "desktop" | "mobile" | "tablet"}){
        const conn = await this._db.getConnection();

        
        if (data.type == "web"){
            let tokens = await conn.all("select * from users_tokens where user_id = ? order by created_at", [data.userId]);
            if (tokens.length >= 3){
                let list = tokens.splice(tokens.length - (tokens.length - 3)).map(x => x.id);
                for (let index = 0; index < list.length; index++) {
                    await conn.run("delete from users_tokens where id = ?", [list[index]]);
                }
            }
        }

        let values = [
            crypto.randomUUID(),
            new Date().toISOString(),
            data.userId,
            data.type,
            data.hostname,
            data.ip,
            data.device,
            "Windows",
            new Date().toISOString()
        ];
        await conn.run("insert into users_tokens values(?, ?, ?, ?, ?, ?, ?, ?, ?)", values);
        conn.close();
        return values[0];
    }

    async delete(id: string): Promise<void> {
        const con = await this._db.getConnection();
        await con.run("delete from users_tokens where id = ?", [id]);
    }
}
