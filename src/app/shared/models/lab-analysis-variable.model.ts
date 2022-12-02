import { LabAnalysisVariableValue } from "./lab-analysis-variable-value.model";

export class LabAnalysisVariable {
    id?: number;
    analyId?: number;
    unitId?: number;
    typeCode?: number;
    Vble_ID?: number;
    secuencia?: number;
    analySecuencia?: number;
    description?: string;
    type?: string;
    analyVNormales?: string;
    groupId?: string;
    send?: string;
    interface?: string;
    status?: string;
    lab_analysis_variable_values:LabAnalysisVariableValue[] = [];
}