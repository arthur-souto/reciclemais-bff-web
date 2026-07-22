export class User {

    private id_user: number;
    private name: string;
    private email: string;
    private cpf: string;
    private password: string;

    constructor(
        id_user: number,
        name: string,
        email: string,
        cpf: string,
        password: string
    ) {
        this.id_user = id_user;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.password = password;
    }

    public getId(): number {
        return this.id_user;
    }

    public getName(): string {
        return this.name;
    }       

    public getEmail(): string {     
    return this.email;
    }

    public getCpf(): string {
        return this.cpf;
    }

    public getPassword(): string {
        return this.password;
    }                                   

    public setId(id_user: number): void {
        this.id_user = id_user;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setCpf(cpf: string): void {
        this.cpf = cpf;
    }

    public setPassword(password: string): void {
        this.password = password;
    }
}