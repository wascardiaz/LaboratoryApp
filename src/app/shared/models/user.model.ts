import { Person } from "./person.model";


export const validatorRoles = ['Admin', 'Bioanalista', 'Super Usuario'];
export const editorRoles = ['Admin', 'Moderator', 'Bioanalista', 'Super Usuario', 'Digitador'];

export function hasPermision(role: Role | undefined) {
    if (role && editorRoles.includes(role.toString())) return true
    return false;
}

export function canValidate(role: Role | undefined) {
    if (role && validatorRoles.includes(role.toString())) return true;
    return false;
}

export class Role {
    id?: number;
    name?: string;
    permission?: string;
}

export class UserGroup {
    id?: number;
    name?: string;
    permission?: string;
    isDeleting?: boolean;
}

export class User {
    id?: number;
    personId?: number;
    username?: string;
    email?: string;
    jwtToken?: string;
    refreshToken?: string;
    role?: Role;
    userId?: number;
}