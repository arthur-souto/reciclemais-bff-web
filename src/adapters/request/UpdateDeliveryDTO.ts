import { IsDate, IsEnum, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength } from "class-validator";
import { DeliveryStatus } from "../../domain/models/delivery";

export class UpdateDeliveryDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Local é obrigatório" })
  @MaxLength(255)
  local?: string;

  @IsOptional()
  @IsDate({ message: "A data de coleta do material é obrigatória" })
  collected_at?: Date;

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
  @IsInt({ message: "O peso deve ser um número inteiro" })
  @Min(1)
  weight?: number;

  @IsOptional()
  @IsInt({ message: "Quantidade deve ser um número inteiro" })
  @Min(1)
  total_score?: number;


  @IsOptional()
  @IsInt({ message: "A latitude deve ser um número inteiro" })
  @Min(1)
  latitude?: number;


  @IsOptional()
  @IsInt({ message: "A longitude deve ser um número inteiro" })
  @Min(1)
  longitude?: number;


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
