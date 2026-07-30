import { IsEmail, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from "class-validator";
import { IsCPF } from "../../validators/CpfValidator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Nome é obrigatório" })
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "Email inválido" })
  email?: string;

  @IsOptional()
  @IsCPF()
  cpf?: string;

  @IsOptional()
  @IsUrl({}, { message: "URL da imagem de perfil inválida" })
  profile_image?: string;

  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: "Telefone inválido, informe DDD + número apenas com dígitos" })
  phone?: string;

  @IsOptional()
  @Matches(/^\d{8}$/, { message: "CEP inválido, informe apenas os 8 dígitos" })
  cep?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;
}
