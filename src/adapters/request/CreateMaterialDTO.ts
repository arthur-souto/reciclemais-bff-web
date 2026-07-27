import { IsEnum, IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";
import { EImportance } from "../../domain/models/material";

export class CreateMaterialDto {
  @IsString()
  @MinLength(1, { message: "Nome é obrigatório" })
  @MaxLength(255)
  name!: string;

  @IsEnum(EImportance, {message: `A importancia deve estar dentro do range ${Object.values(EImportance).filter(i => typeof i === 'number')}`})
  importance!: EImportance;

  @IsInt({ message: "Valor em pontos deve ser um número inteiro" })
  @Min(0)
  points_value!: number;
}
