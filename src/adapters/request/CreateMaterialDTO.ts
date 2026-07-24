import { IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateMaterialDto {
  @IsString()
  @MinLength(1, { message: "Nome é obrigatório" })
  @MaxLength(255)
  name!: string;

  @IsInt({ message: "Importância deve ser um número inteiro" })
  @Min(1)
  importance!: number;

  @IsInt({ message: "Valor em pontos deve ser um número inteiro" })
  @Min(0)
  points_value!: number;
}
