import { Address } from "./address.model";
import { BancoCuenta } from "./banco_cuenta.model";

export class Supplier {
    id: number = 0;
    rnc?: string;
    cedula?: string;
    razon_social?: string;
    nombre_comercial?: string;
    contacto?: string;
    web_site?: string;
    api_url?: string;
    email?: string;
    local?: string;
    tipo?: string;
    mercado?: string;

    address?: Address;

    direccion?: string;
    sector?: string;
    ciudad?: string;
    lugar_tipo?: string;
    lug_nombre?: string;
    lug_numero?: string;
    lug_apto?: string;
    sect_codigo?: string;
    ciud_codigo?: string;
    zona_codigo?: string;
    oficina?: string;

    telefono?: string;
    fax?: string;
    movil?: string;
    limite_credito?: string;
    fecha_corte?: string;
    descto_pago?: string;
    pago_codigo?: string;

    cuenta?: BancoCuenta;
    
    grup_codigo?: string;
    comentario?: string;
    categoria?: string;
    grupo?: string;
    itbis?: string;
    descto?: string;
    mone_codigo?: string;
    apertura?: string;
    limite?: string;
    nucf_grupo?: string;
    nucf_prefijo?: string;
    dgii_tipo?: string;
    inve_grupo?: string;
    porc_itbis?: string;
    porc_retencion?: string;
    dgii_costo?: string;
    clas_codigo?: string;
    dpto_codigo?: string;
    tipodoc?: string;
    porc_isr?: string;
    bcos_cuenta?: string;
    bcos_codigo?: string;
    plan_codigo?: string;

    created?: Date;
    updated?: Date;
    userId?: number;
    status?: boolean;
}