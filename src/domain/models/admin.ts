
export interface IAdmin {
    id_admin: number;
    password_admin: string;
    email_admin: string;
    role: string
}

export class Admin implements IAdmin {
    id_admin: number;
    password_admin: string;
    email_admin: string;
    role: string;
}