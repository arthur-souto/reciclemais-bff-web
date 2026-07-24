import { IsInt, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength } from "class-validator";

export class CreateDeliveryDto {
  @IsString()
  @MinLength(1, { message: "Local é obrigatório" })
  @MaxLength(255)
  local!: string;

  @IsString()
  @MinLength(1, { message: "Tipo de material é obrigatório" })
  @MaxLength(255)
  material_type!: string;

  @IsInt({ message: "Quantidade deve ser um número inteiro" })
  @Min(1)
  quantity!: number;

  @IsInt({ message: "Material inválido" })
  fk_material!: number;

  @IsOptional()
  @IsUrl({}, { message: "URL de evidência inválida" })
  evidence_url?: string;
}
