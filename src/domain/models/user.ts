export interface IUser {
    id_user: number;
    name_user: string;
    email_user: string;
    cpf: string;
    password_user: string;
}

export class User implements IUser {

    id_user: number;
    name_user: string;
    email_user: string;
    cpf: string;
    password_user: string;

    constructor(
        id_user: number,
        name_user: string,
        email_user: string,
        cpf: string,
        password_user: string
    ) {
        this.id_user = id_user;
        this.name_user = name_user;
        this.email_user = email_user;
        this.cpf = cpf;
        this.password_user = password_user;
    }

    getId_user(): number {
        return this.id_user;
    }

    setId_user(id_user: number): void {
        this.id_user = id_user;
    }

    getName_user(): string {
        return this.name_user;
    }

    setName_user(name_user: string): void {
        this.name_user = name_user;
    }

    getEmail_user(): string {
        return this.email_user;
    }

    setEmail_user(email_user: string): void {
        this.email_user = email_user;
    }

    getcpf(): string {
        return this.cpf;
    }

    setCpf(cpf: string): void {
        this.cpf = cpf;
    }

    getPassword_user(): string {
        return this.password_user;
    }

    setPassword_user(password_user: string): void {
        this.password_user = password_user;
    }
}