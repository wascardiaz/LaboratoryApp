export class Banco {
    id?: number;
    cuenta?: string;
}

enum GrupoCuenta {
    ACTIVOS,
    PASIVOS,
    CAPITAL,
    INGRESOS,
    COSTOS,
}

enum BancoCuentaTipo {
    Debito,
    Credito
}

export class BancoCuenta {
    id?: number;
    tipo?: BancoCuentaTipo;
    numero?: string;
    debito?: string;
    retencion?: string;
    itbis?: string;
    isr?: string;
    banco?: Banco;
    created?: Date;
    updated?: Date;
    userId?: number;
    status?: boolean;
}