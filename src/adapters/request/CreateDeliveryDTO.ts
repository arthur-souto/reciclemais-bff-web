import { IsDate, isInt, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength } from "class-validator";

export class CreateDeliveryDto {
  @IsString()
  @MinLength(1, { message: "Local é obrigatório" })
  @MaxLength(255)
  local!: string;

  @IsDate({message: "A data de coleta do material é obrigatória"})
  collected_at!:Date;


  @IsString()
  @MinLength(1, { message: "Tipo de material é obrigatório" })
  @MaxLength(255)
  material_type!: string;

  @IsInt({ message: "A pontuação final deve ser um número inteiro" })
  @Min(1)
  total_score!: number;

  @IsInt({ message: "Quantidade deve ser um número inteiro" })
  @Min(1)
  quantity!: number;

  @IsInt({ message: "O peso deve ser um número inteiro" })
  @Min(1)
  weight!: number;

  @IsInt({ message: "A latitude deve ser um número inteiro" })
  @Min(1)
  latitude!: number;

  @IsInt({ message: "A longitude deve ser um número inteiro" })
  @Min(1)
  longitude!: number;

  @IsInt({ message: "Material inválido" })
  fk_material!: number;

  @IsOptional()
  @IsUrl({}, { message: "URL de evidência inválida" })
  evidence_url?: string;
}
