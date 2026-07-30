import { User, UserRole } from "../../../domain/models/user";
import { CreateUserDto } from "../../request/CreateUserDTO";
import { UpdateUserDto } from "../../request/UpdateUserDTO";

export function toUserResponse(user: User): {
    id: string | null;
    name: string;
    email: string;
    cpf: string;
    role: UserRole;
    profile_image: string | null;
    phone: string | null;
    cep: string | null;
    address: string | null;
    total_score: number;
    created_at: Date;
    updated_at: Date;
} {
    return {
        id: user.getId() || null,
        name: user.getName(),
        email: user.getEmail(),
        cpf: user.getCpf(),
        role: user.getRole(),
        profile_image: user.getProfileImage(),
        phone: user.getPhone(),
        cep: user.getCep(),
        address: user.getAddress(),
        total_score: user.getTotalScore(),
        created_at: user.getCreatedAt(),
        updated_at: user.getUpdatedAt(),
    };
}

export function fromUserCreateRequest(req: CreateUserDto) {
    return new User(
        null,
        req.name,
        req.email,
        req.cpf,
        req.password,
        "USER",
        req.profile_image ?? null,
        req.phone ?? null,
        req.cep ?? null,
        req.address ?? null
    )
}

export function applyUserUpdateRequest(user: User, req: UpdateUserDto): User {
    if (req.name !== undefined) user.setName(req.name);
    if (req.email !== undefined) user.setEmail(req.email);
    if (req.cpf !== undefined) user.setCpf(req.cpf);
    if (req.profile_image !== undefined) user.setProfileImage(req.profile_image);
    if (req.phone !== undefined) user.setPhone(req.phone);
    if (req.cep !== undefined) user.setCep(req.cep);
    if (req.address !== undefined) user.setAddress(req.address);
    return user;
}