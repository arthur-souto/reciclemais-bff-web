import { User, UserRole } from "../../../domain/models/user";
import { CreateUserDto } from "../../request/CreateUserDTO";
import { UpdateUserDto } from "../../request/UpdateUserDTO";

export function toUserResponse(user: User): {
    id: string | null;
    name: string;
    email: string;
    cpf: string;
    role: UserRole;
} {
    return {
        id: user.getId() || null,
        name: user.getName(),
        email: user.getEmail(),
        cpf: user.getCpf(),
        role: user.getRole(),
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

export function applyUserUpdateRequest(user: User, req: UpdateUserDto): User {
    if (req.name !== undefined) user.setName(req.name);
    if (req.email !== undefined) user.setEmail(req.email);
    if (req.cpf !== undefined) user.setCpf(req.cpf);
    return user;
}