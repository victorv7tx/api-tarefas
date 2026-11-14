import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Prioridade } from '../prioridade.enum';

export class CreateTarefaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  titulo: string;

  @IsOptional()
  @IsEnum(Prioridade)
  prioridade?: Prioridade;

  @IsOptional()
  @IsDateString()
  prazo?: string;
}