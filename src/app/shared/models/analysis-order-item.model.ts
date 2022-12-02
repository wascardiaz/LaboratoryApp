export class AnalysisOrderItem {
    id?: number;
    secuencia?: number;
    orderId?: number;
    caseId?: number;
    groupId: number = 0;
    // itemId?: number;
    testId?: number;
    groupName: string = '';
    description: string = '';
    itemName?: string;
    qty: number = 0;
    price: number = 0.00;
    cost: number = 0.00;
    percent: number = 0.00;
    acuerdo: number = 0.00;
    descto: number = 0.00;
    coberture: number = 0.00;
    diference: number = 0.00;
    ajuste?: number;
    total: number = 0;
    
    // qty: number = 0;
    // total?: number;
    // reqId?: number;
    referencia?: string;
    // mdcoId?: number;
    // mdcoValue?: number;
    recpId?: number;
    resuId?: number;
    // diagId?: number;
    userId?: number;
    created?: Date;
    updated?: Date;
}
