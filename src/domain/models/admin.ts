

export class Admin {
    id_admin: number;
    password: string;
    email: string;
    role: string;

    constructor(
        id_admin: number,
        password: string,
        email: string,
        role: string
    ) {
        this.id_admin = id_admin;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    getId_admin(): number {
        return this.id_admin;
    }

    setId_admin(id_admin: number): void {
        this.id_admin = id_admin;
    }

    getPassword(): string {
        return this.password;
    }

    setPassword(password: string): void {
        this.password = password;
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    getRole(): string {
        return this.role;
    }

    setRole(role: string): void {
        this.role = role;
    }
}