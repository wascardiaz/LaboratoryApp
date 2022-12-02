import { Service } from "./service.model";
import { User } from "./user.model";

export class Studio {
    id?: number;
    service?: Service
    description?: string;
    level?: string;
    modifier?: boolean;
    price?: number;
    discont?: number;
    status?: boolean;
    user?: User;
    userId?: number;
    created?: Date;
    updated?: Date;
    cupsCode?: string;
    Cie9_Code?: string;
    Cie10_Code?: string;
}