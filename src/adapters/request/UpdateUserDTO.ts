import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
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
}
