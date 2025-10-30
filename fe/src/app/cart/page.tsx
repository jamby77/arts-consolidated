import { Cart } from "@/components/cart/cart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Your Cart</h1>
      <Cart />
    </div>
  );
}
