export class ProductOrderRequest {
    productId: number = 0;
    quantity?: number;
    pricePerUnit?: number;
    qualityCheck?: string;
    deliveryDate?: string;
    expiryDate?: string;
    manufactureDate?: string;
    distributorId?: number;
    created?: Date;
    updated?: Date;
    userId?: number;
}