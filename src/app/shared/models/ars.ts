export class ArsPlan {
    id?: number;
    seguId?: number;
    name?: string;
    percent?: number;
    status?: boolean;
}

export class Ars {
    id?: number;
    name?: string;
    rnc?: string;
    telephone?: string;
    address?: string;
    fax?: string;
    phoneAutorization?: string;
    url?: string;
    email?: string;
    abbreviature?: string;
    ncfTypeId?: string;
    ncLote?: string;
    contact?: string;
    contractStart?: string;
    contractEnd?: string;
    cuteDate?: string;
    margen_medicamento?: string;
    margen_material?: string;
    codigo_prestador?: string;
    cuentaId?: string;
    invouceNote?: string;
    comment?: string;
    cobertura_emergencia?: string;
    solicita_info?: string;
    status?: string;
    userId?: string;
}

export class ArsCobertura {
    id?: number;
    testId?: number;
    seguId?: number;
    seguPlanId?: number;
    seguCode?: string;
    cupsCode?: string;
    simonCode?: string;
    price?: number;
    userId?: number;
    status?: boolean;
    created?: Date;
    updated?: Date;
}