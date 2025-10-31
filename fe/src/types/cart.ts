export type CartItem = {
  id: number;
  title: string;
  price: number;
  finalPrice: number;
  discountPercentage: number;
  quantity: number;
  thumbnail?: string;
};
