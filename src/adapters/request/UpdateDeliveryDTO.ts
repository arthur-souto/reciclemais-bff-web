import { IsEnum, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength } from "class-validator";
import { DeliveryStatus } from "../../domain/models/delivery";

export class UpdateDeliveryDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Local é obrigatório" })
  @MaxLength(255)
  local?: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Tipo de material é obrigatório" })
  @MaxLength(255)
  material_type?: string;

  @IsOptional()
  @IsInt({ message: "Quantidade deve ser um número inteiro" })
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsInt({ message: "Material inválido" })
  fk_material?: number;

  @IsOptional()
  @IsUrl({}, { message: "URL de evidência inválida" })
  evidence_url?: string;

  @IsOptional()
  @IsEnum(DeliveryStatus, { message: "Status inválido" })
  status?: DeliveryStatus;
}
