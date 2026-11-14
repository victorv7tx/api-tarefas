import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const erro =
      exception instanceof Error ? exception : new Error(String(exception));

    // Registra o erro real no terminal, com a pilha de chamadas
    this.logger.error(`${req.method} ${req.url} - ${erro.message}`, erro.stack);

    // O cliente recebe uma mensagem genérica, sem detalhes internos
    res.status(500).json({
      statusCode: 500,
      message: 'Erro interno do servidor',
      method: req.method,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}