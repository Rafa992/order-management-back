export class OrderDto {
  status: string;
  totalAmount: number;
  totalPrice: number;
  address: string;
  paymentMethod: string;
  comment?: string;
  userId: string;
  username: string;
  orderNumber: string;
  products: {
    id: string;
    title: string;
    description: string;
    price: number;
    newPrice: number;
    amount: number;
  }[];
}

export class EditOrderDto extends OrderDto {
  id: string;
}