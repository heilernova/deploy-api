import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';


@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        let body = {
            name: "Contable",
            status_code: 500,
            message: "Error interno del servidor",
            detail: undefined,
            links: [
                "https://deploy.novah.dev",
                "https://novah.dev"
            ]
        }

        if (exception instanceof HttpException){
            super.catch(exception, host);
        }
        
        if (process.env.NODE_ENV == "development"){
            if (exception instanceof HttpException){
                let res = exception.getResponse();
                body.status_code = exception.getStatus();
                if (typeof res == "string"){
                    body.message = res;
                } else {
                    body.message = (res as any).message;
                    (res as any).message = undefined;
                    body.detail = (res as any).detail;
                }
            }
        }



        super.catch(new HttpException(body, body.status_code), host);
    }
}