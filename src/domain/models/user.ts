
export interface IUser {
    id_user: number;
    name_user: string;
    email_user: string;
    CPF: string;
    password_user: string

}

export class User implements IUser {

    id_user: number;
    name_user: string;
    email_user: string;
    CPF: string;
    password_user: string;

}