import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tarefa } from './tarefas.interface';

@Injectable()
export class TarefasService {
  private tarefas: Tarefa[] = [];
  private idCounter = 1;

  listar(feita?: boolean): Tarefa[] {
    if (feita === undefined) {
      return this.tarefas;
    }
    return this.tarefas.filter((t) => t.feita === feita);
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

  criar(titulo: string): Tarefa {
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