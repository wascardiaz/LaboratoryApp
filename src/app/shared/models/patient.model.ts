import { Person } from "./person.model";
import { Role, UserGroup } from "./user.model";

export class Patient {
    id?: string;
    personId?: number;
    patientTypeId?: number;
    medicoId?: number;
    sangreId?: number;
    fallecido?: boolean;
    motivo_fellecio?: string;
    fecha_fellecido?: Date;
    observacion?: string;
    peso?: string;
    nss?: string;
    antecedentes_familiares?: string;
    web_usuario?: string;
    web_clave?: string;
    vip?: boolean;
    vip_mensaje?: string;
    no_grato?: boolean;
    nograto_mensaje?: string;
    tarjeta?: string;
    gestion_cobro?: string;
    image?: string;
    created?: Date;
    updated?: Date;
    isVerified?: boolean;
    userId?: number;
    status?: boolean;
    person?: Person = new Person();
    tipo?: Patient
}