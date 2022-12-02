import { Warehouse } from './warehouse.model';

export class Product {
    id: number = 0;
    name?: string;
    description?: string;
    quantityAvailable?: number;
    quantityUnit?: string;
    warehouse?: Warehouse;
    created?: Date;
    updated?: Date;
    userId?: number;
    status?: boolean;
}