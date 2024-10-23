import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DatabaseService } from 'src/common/database';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _db: DatabaseService){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    let request = context.switchToHttp().getRequest<Request>();
    let authorization: string | undefined = request.headers["authorization"];

    if (!authorization) throw new HttpException("Sin autorización", 401);
    
    let split = authorization.split(' ');
    
    if (split[0].toLowerCase() == "basic"){
      let [username, token] = Buffer.from(authorization.split(' ')[1], "base64").toString("utf-8").split(":");
      const con = await this._db.getConnection();
      let result: { id: string, role: "admin" | "collaborator", email: string } | undefined = await con.get("SELECT a.id, a.role, a.email FROM users_tokens b INNER JOIN users a ON a.id  = b.user_id where b.id = ?", [token]);
      if (!result){
        throw new HttpException("Token invalido", 401);
      }
      
      if (username.toLowerCase() != result.email){
        await con.run("delete from users_tokens where id = ?", [token]);
        throw new HttpException("Error validación de token", 401);
      }

      request["appSession"] = { token, ...result };
      return true;
    }
    
    return false;
  }
}
