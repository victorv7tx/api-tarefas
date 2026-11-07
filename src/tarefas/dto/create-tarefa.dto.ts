import {IsNotEmpty, IsString, MaxLength} from "class-validator";

export class CreateTarefaDto {
    @IsString ()
    @IsNotEmpty()
    @MaxLength(100)
    titulo: string;
}