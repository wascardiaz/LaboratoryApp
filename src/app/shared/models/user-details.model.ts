import { Person } from "./person.model"; 
import { Role, UserGroup } from "./user.model";

export class UserDetails {
    id?: string;
    username?: string;
    email?: string;
    role?: Role;
    userGroup?: UserGroup;
    designation?: string;
    person?: Person;
    acceptTerms?: boolean;
    verificationToken?: string;
    verified?: Date;
    resetToken?: string;
    resetTokenExpires?: Date;
    image?: string;
    passwordReset?: Date;
    created?: Date;
    updated?: Date;
    isVerified?: boolean;
    userId?: number;
}