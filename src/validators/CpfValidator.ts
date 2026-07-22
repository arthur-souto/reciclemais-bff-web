import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: "isCPF", async: false })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (typeof value !== "string") return false;

    const cpf = value.replace(/[^\d]/g, "");

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    const calcDigit = (base: string, factor: number) => {
      let total = 0;
      for (const digit of base) {
        total += Number(digit) * factor--;
      }
      const rest = (total * 10) % 11;
      return rest === 10 ? 0 : rest;
    };

    const digit1 = calcDigit(cpf.slice(0, 9), 10);
    const digit2 = calcDigit(cpf.slice(0, 9) + digit1, 11);

    return cpf === cpf.slice(0, 9) + digit1 + digit2;
  }

  defaultMessage() {
    return "CPF inválido";
  }
}

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions || {},
      constraints: [],
      validator: IsCPFConstraint,
    });
  };
}