import { User } from "../../../domain/models/user";
import { CreateUserDto } from "../../request/CreateUserDTO";

export function toUserResponse(user: User): {
    id: string | null;
    name: string;
    email: string;
    cpf: string;
} {
    return {
        id: user.getId() || null,
        name: user.getName(),
        email: user.getEmail(),
        cpf: user.getCpf(),
    };
}

export function fromUserCreateRequest(req: CreateUserDto) {
    return new User(
        null,
        req.name,
        req.email,
        req.cpf,
        req.password
    )
}