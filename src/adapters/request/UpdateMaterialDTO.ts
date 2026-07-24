import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class UpdateMaterialDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Nome é obrigatório" })
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsInt({ message: "Importância deve ser um número inteiro" })
  @Min(1)
  importance?: number;

  @IsOptional()
  @IsInt({ message: "Valor em pontos deve ser um número inteiro" })
  @Min(0)
  points_value?: number;
}
