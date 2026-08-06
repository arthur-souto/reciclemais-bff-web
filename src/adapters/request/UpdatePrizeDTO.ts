import { IsDate, IsEnum, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength } from "class-validator";
import { Type } from "class-transformer";
import { PrizeStatus } from "../../domain/models/prize";

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

  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Categoria é obrigatória" })
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsUrl({}, { message: "URL da imagem inválida" })
  image_url?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: "Data de expiração inválida" })
  expiration_date?: Date;

  @IsOptional()
  @IsEnum(PrizeStatus, { message: "Status inválido" })
  status?: PrizeStatus;
}
