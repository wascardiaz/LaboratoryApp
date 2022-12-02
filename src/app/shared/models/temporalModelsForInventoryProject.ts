export class User {
    id?: number;
    username?: string; // 25
    password?: number; // 64
    role?: number;
}

export class UserDetails {
    userId?: number;
    firstName?: string; // 32
    lastName?: string; // 32
    dob?: Date;
    email?: string; // 96
    phone?: string; // 10
    gender?: string; // 1
    designation?: string; // 25
}

export class Address {
    userId?: number;
    city?: string; // 32
    street?: string; // 150
    pinCode?: string;
}

export class Producto {
    id?: number;
    productName?: string;
    description?: string;
    quantityAvailable?: number;
    quatityUnit?: string;
    wareHouseId?: number;
}

export class RawMaterial {
    id?: number;
    materialName?: string;
    description?: string;
    quantityAvailable?: number;
    quantityUnit?: string;
    wareHouseId?: number;
}

export class ProductOrder {
    id?: number;
    productId?: number;
    pricePerUnit?: number;
    quantityUnit?: string; // Units will be an Enum
    quantity?: number;
    dilveryDate?: Date; // Estimate date
    expireDate?: Date; // Last date
    qualityCheck?: string;
    supplierId?: number;
    orderedOn?: Date;
    orderStatus?: string;
}

export class RawMaterialOrder {
    id?: number;
    rawMaterialId?: number;
    pricePerUnit?: number;
    quantityUnit?: string; // Units will be an Enum
    quantity?: number;
    diveryDate?: Date;
    manufacturingDate?: Date;
    expireDate?: Date;
    supplierId?: number;
    qualityCheck?: string;
    orderedOn?: Date;
    orderStatus?: string;
}