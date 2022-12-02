import { Warehouse } from './warehouse.model';

export class ProductOrder {
    id: number = 0;
    quantity?: number;
    pricePerUnit?: number;
    qualityCheck?: string;
    orderStatus?: string;
    deliveryDate?: string;
    manufactureDate?: string;
    expiryDate?: string;
    orderedOn?: string;
    productId?: number;
    productName?: string;
    description?: string;
    distributorId?: number;
    distributorName?: string;
    measurementUnit?: string;
    warehouse?: Warehouse;
    created?: Date;
    updated?: Date;
    userId?: number;
}