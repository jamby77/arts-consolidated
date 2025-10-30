import Image from "next/image";
import { useCart } from "@/store/cart";
import { CartItem } from "@/types/cart";

export function Item({ item }: { item: CartItem }) {
  const remove = useCart((s) => s.remove);
  return (
    <div
      key={item.id}
      className="flex items-center gap-4 rounded-xl border border-black/10 bg-white p-3 dark:border-white/15 dark:bg-black/40"
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-md bg-black/5 dark:bg-white/10">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <Image
            src="/next.svg"
            alt={item.title}
            fill
            className="object-contain p-2"
            sizes="80px"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{item.title}</div>
        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          Qty: {item.quantity}
        </div>
      </div>
      <div className="w-20 text-right text-sm font-medium">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      <button
        onClick={() => remove(item.id)}
        className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 px-3 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
      >
        Remove
      </button>
    </div>
  );
}
