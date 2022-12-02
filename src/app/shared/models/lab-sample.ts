import { Time } from "@angular/common";

export class LabSampleDetails {
    id?: number;
    recpId?: number;
    detailId?: number;
    analyId?: number;
    analysisGroupId?: number;
    caseId?: number;
    cargId?: number;
    cargSecuenciaId?: number;
    resuId?: number;
    sampleTypeId: number = 0;
    // groupId?: number;
    // testId?: number;
    sampleLote?: number;
    samplePrioridad?: string;
    casoCondiciones?: string;
    samplePeriodo?: string;
    sampleRecord?: string;
    sampleRecogida?: Date;
    sampleProceso?: Date;
    sampleEnvasada?: Date;
    sampleTemperatura?: string;
    sampleCaduce?: Date;
    sampleCondiciones?: string;
    resuEntrega?: string;
    sampleHora?: Time;
    sampleDate?: Date;
    sampleEstatus?: string;
    sampleUpdated?: Date;
    description?: string;
    rowspn: number = 1;
    sampleDescription?: string;
    testDescription?: string;
    groupDescription?: string;
}

export class LabSample {
    id?: number;
    caseId?: number;
    mdcoId?: number;
    groupId?: number;
    testId?: number;
    recpDate?: Date;
    recpTime?: Time;
    recpNote?: string;
    caseCondictions?: string;
    resuEntrega?: Date;
    userId?: number;
    created?: Date;
    updated?: Date;
    status?: string;
}