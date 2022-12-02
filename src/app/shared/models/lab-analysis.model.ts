import { LabAnalysisVariable } from "./lab-analysis-variable.model";

export class LabAnalysis {
    id: number | null = null;
    testId?: number;
    sampleTypeId: number | null = null;
    analysisGroupId?: number | null = null;
    analysisSubGroupId?: number | null = null;
    labMethodId?: number | null = null;
    labEquipmentId?: number | null = null;
    sampleContainerId?: number | null = null;
    labId?: number | null = null;
    description?: string;
    abbreviation?: string;
    sex?: string;
    condition?: string;
    day?: string;
    days?: string;
    webResult?: string;
    normalValue?: string;
    status?: boolean;
    variables: LabAnalysisVariable[] = [];
    created?: string;
    updated?: string;
}