import { Product } from "@/lib/api";
import { ListItem } from "./list-item";

export function Listing({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {products.map((p) => (
        <ListItem key={p.id} product={p} />
      ))}
    </ul>
  );
}
