import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class UpdatePrizeDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Nome é obrigatório" })
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsInt({ message: "Pontos necessários deve ser um número inteiro" })
  @Min(1)
  required_points?: number;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Descrição é obrigatória" })
  description?: string;
}
