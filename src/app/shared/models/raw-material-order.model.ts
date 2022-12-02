import { Warehouse } from "./warehouse.model";

export class RawMaterialOrder {
    id: number = 0;
    quantity?: number;
    pricePerUnit?: number;
    qualityCheck?: string;
    orderStatus?: string;
    deliveryDate?: string;
    expiryDate?: string;
    orderedOn?: string;
    materialName?: string;
    description?: string;
    supplierId?: number;
    supplierName?: string;
    measurementUnit?: string;
    warehouse?: Warehouse;
    created?: Date;
    updated?: Date;
    userId?: number;
}