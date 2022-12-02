export class Order {
    id?: number;
    orderNo?: string;
    customerId?: number;
    pMethod?: string;
    total: number = 0;
    deletedOrderItemsIds?: string;
}
