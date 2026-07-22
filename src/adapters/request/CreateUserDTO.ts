import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
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
}