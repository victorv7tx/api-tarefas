import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tarefa } from './tarefas.interface';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { FiltroTarefasDto } from '../categorias/dto/filtro-tarefas.dto';

@Injectable()
export class TarefasService {
  private tarefas: Tarefa[] = [];
  private proximoId = 1;

 /* listar(feita: boolean): Tarefa[] {
    if (filtro.feita === undefined) {
      return this.tarefas;
    }
    return this.tarefas.filter((t) => t.feita === feita);
  }*/

    listar(filtro: FiltroTarefasDto) {
    if (filtro.feita === undefined) {
      return this.tarefas; 
    }
    const feita = filtro.feita === 'true';
    return this.tarefas.filter((tarefa) => tarefa.feita === feita)
  }

  resumo() {
    const total = this.tarefas.length;
    const feitas = this.tarefas.filter((t) => t.feita).length;
    return { total, feitas, pendentes: total - feitas };
  }

  buscarPorId(id: number): Tarefa {
    const tarefa = this.tarefas.find((t) => t.id === id);
    if (!tarefa) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }
    return tarefa;
  }

 /* criar(titulo: string): Tarefa {
    if (!titulo || titulo.trim() === '') {
      throw new BadRequestException('O título é obrigatório.');
    }
    const novaTarefa: Tarefa = {
      id: this.idCounter++,
      titulo: titulo.trim(),
      feita: false,
    };
    this.tarefas.push(novaTarefa);
    return novaTarefa;
  }*/

  criar(body: CreateTarefaDto) {
    const titulo = body.titulo.trim().toLowerCase()
    const tituloExiste = this.tarefas.some(
      (t) => t.titulo.toLocaleLowerCase() === titulo 
    )

    if (tituloExiste) {
      throw new ConflictException("Título já cadastrado!")
    }
    const tarefa = {id: this.proximoId++, titulo: body.titulo, feita:false};
    this.tarefas.push(tarefa);
    return tarefa;
  }

  atualizar(id: number, dados: Partial<Tarefa>): Tarefa {
    const tarefa = this.buscarPorId(id);
    if (dados.titulo !== undefined) {
      if (dados.titulo.trim() === '') {
        throw new BadRequestException('O título não pode ficar vazio.');
      }
      tarefa.titulo = dados.titulo.trim();
    }
    if (dados.feita !== undefined) tarefa.feita = dados.feita;
    return tarefa;
  }

  remover(id: number): void {
    const index = this.tarefas.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }
    this.tarefas.splice(index, 1);
  }
}