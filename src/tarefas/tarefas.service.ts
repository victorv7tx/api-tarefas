import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tarefa } from './tarefas.interface';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { FiltroTarefasDto } from '../categorias/dto/filtro-tarefas.dto';
import { Prioridade } from './prioridade.enum';

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

   /* listar(filtro: FiltroTarefasDto) {
    if (filtro.feita === undefined) {
      return this.tarefas; 
    }
    const feita = filtro.feita === 'true';
    return this.tarefas.filter((tarefa) => tarefa.feita === feita)
  }*/
 
    listar(filtro: FiltroTarefasDto) {
  let resultado = this.tarefas;

  if (filtro.feita !== undefined) {
    const feita = filtro.feita === 'true';
    resultado = resultado.filter((t) => t.feita === feita);
  }

  const pagina = filtro.pagina ?? 1;
  const limite = filtro.limite ?? 10;
  const total = resultado.length;
  const inicio = (pagina - 1) * limite;

  return {
    dados: resultado.slice(inicio, inicio + limite),
    pagina,
    limite,
    total,
    totalPaginas: Math.ceil(total / limite),
  };
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

  criar(body: CreateTarefaDto): Tarefa {
  const titulo = body.titulo.trim().toLowerCase();
  const tituloExiste = this.tarefas.some(
    (t) => t.titulo.toLocaleLowerCase() === titulo,
  );

  if (tituloExiste) {
    throw new ConflictException('Título já cadastrado!');
  }

  this.validarPrazo(body.prazo);

  const tarefa: Tarefa = {
    id: this.proximoId++,
    titulo: body.titulo,
    feita: false,
    prioridade: body.prioridade ?? Prioridade.MEDIA,
    prazo: body.prazo,
  };
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
  if (dados.prioridade !== undefined) tarefa.prioridade = dados.prioridade;
  if (dados.prazo !== undefined) {
    this.validarPrazo(dados.prazo);
    tarefa.prazo = dados.prazo;
  }
  return tarefa;
}

  remover(id: number): void {
    const index = this.tarefas.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }
    this.tarefas.splice(index, 1);}
    private validarPrazo(prazo?: string): void {
  if (prazo === undefined) return;
  if (new Date(prazo).getTime() < Date.now()) {
    throw new BadRequestException('O prazo não pode ser uma data que já passou.');
  }
 }
}