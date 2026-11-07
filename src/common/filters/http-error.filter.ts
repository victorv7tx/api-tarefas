import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import type { Request, Response } from "express";

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const corpo = exception.getResponse();

        ctx.getResponse<Response>().status(status).json({
            statusCode: status,
            message: typeof corpo === 'string' ? corpo : (corpo as any).message,
            method: req.method,
            path: req.url,
            timestamp: new Date().toISOString()
        })
    }
}