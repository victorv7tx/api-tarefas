import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TarefasService } from './tarefas.service';

@Controller('tarefas')
export class TarefasController {
  constructor(private readonly service: TarefasService) {}

  // GET /tarefas  ou  GET /tarefas?feita=true
  @Get()
  listar(@Query('feita') feita?: string) {
    const filtro = feita === undefined ? undefined : feita === 'true';
    return this.service.listar(filtro);
  }

  // IMPORTANTE: esta rota precisa vir ANTES da rota ':id'
  @Get('resumo')
  resumo() {
    return this.service.resumo();
  }

  @Get(':id')
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarPorId(id);
  }

  @Post()
  criar(@Body() body: { titulo: string }) {
    return this.service.criar(body?.titulo);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { titulo?: string; feita?: boolean },
  ) {
    return this.service.atualizar(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remover(@Param('id', ParseIntPipe) id: number) {
    this.service.remover(id);
  }
}