import { IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreatePrizeDto {
  @IsString()
  @MinLength(1, { message: "Nome é obrigatório" })
  @MaxLength(255)
  name!: string;

  @IsInt({ message: "Pontos necessários deve ser um número inteiro" })
  @Min(1)
  required_points!: number;

  @IsString()
  @MinLength(1, { message: "Descrição é obrigatória" })
  description!: string;
}
