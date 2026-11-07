import { IsIn, IsOptional } from "class-validator";

export class FiltroTarefasDto {
    @IsOptional()
    @IsIn(['true', 'false'], {message:'feita deve ser true ou false'})
    feita?: string
}