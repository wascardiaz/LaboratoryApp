export class OrderItem {
    id?: number;
    orderId?: number;
    itemId?: number;
    qty: number = 0;
    itemName?: string;
    price?: number;
    total: number = 0;
}
