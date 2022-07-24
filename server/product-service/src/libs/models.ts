export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
}

export interface ProductStock extends Product {
    count: number;
}