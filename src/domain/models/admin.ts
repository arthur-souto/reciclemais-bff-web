export interface IAdmin {
    id_admin: number;
    password_admin: string;
    email_admin: string;
    role: string;
}

export class Admin implements IAdmin {
    id_admin: number;
    password_admin: string;
    email_admin: string;
    role: string;

    constructor(
        id_admin: number,
        password_admin: string,
        email_admin: string,
        role: string
    ) {
        this.id_admin = id_admin;
        this.password_admin = password_admin;
        this.email_admin = email_admin;
        this.role = role;
    }

    getId_admin(): number {
        return this.id_admin;
    }

    setId_admin(id_admin: number): void {
        this.id_admin = id_admin;
    }

    getPassword_admin(): string {
        return this.password_admin;
    }

    setPassword_admin(password_admin: string): void {
        this.password_admin = password_admin;
    }

    getEmail_admin(): string {
        return this.email_admin;
    }

    setEmail_admin(email_admin: string): void {
        this.email_admin = email_admin;
    }

    getRole(): string {
        return this.role;
    }

    setRole(role: string): void {
        this.role = role;
    }
}