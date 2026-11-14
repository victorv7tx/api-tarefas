import { Prioridade } from './prioridade.enum';

export interface Tarefa {
  id: number;
  titulo: string;
  feita: boolean;
  prioridade: Prioridade;
  prazo?: string;
}