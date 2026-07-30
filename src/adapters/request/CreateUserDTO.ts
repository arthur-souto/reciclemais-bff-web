import { IsEmail, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from "class-validator";
import { IsCPF, IsCPFConstraint } from "../../validators/CpfValidator";

export class CreateUserDto {
  @IsString()
  @MinLength(1, { message: "Nome é obrigatório" })
  @MaxLength(255)
  name!: string;

  @IsEmail({}, { message: "Email inválido" })
  email!: string;

  @IsCPF()
  cpf!: string

  @MinLength(8, { message: "Senha deve ter no mínimo 8 caracteres" })
  password!: string;

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