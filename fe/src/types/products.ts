export type Product = {
  id: number;
  sku: string;
  title: string;
  description: string;
  price: number;
  weight: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: {
    rating: number;
    comment?: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
