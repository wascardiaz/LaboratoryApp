import { UserDetails } from "./user-details.model";

export class UserDetailsEdit extends UserDetails {
    securityQuestion?: string;
    securityAnswer?: string;
}