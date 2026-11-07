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
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/upDate-tarefa.dto';
import { FiltroTarefasDto } from '../categorias/dto/filtro-tarefas.dto';

@Controller('tarefas')
export class TarefasController {
  constructor(private readonly service: TarefasService) {}

  @Get()
    listar(
      @Query() filtro: FiltroTarefasDto  
    ) { return this.service.listar(filtro); }

 
  @Get('resumo')
  resumo() {
    return this.service.resumo();
  }

  @Get(':id')
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarPorId(id);
  }

  @Post()
  criar(@Body() body: CreateTarefaDto) {
    return this.service.criar(body);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTarefaDto ,
  ) {
    return this.service.atualizar(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remover(@Param('id', ParseIntPipe) id: number) {
    this.service.remover(id);
  }
}