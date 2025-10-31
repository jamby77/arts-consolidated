import { useCart, useCartCount, useCartTotal } from "@/store/cart";

export function Summary() {
  const clear = useCart((s) => s.clear);
  const count = useCartCount();
  const total = useCartTotal();
  return (
    <div className="h-fit rounded-xl border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-black/40">
      <h2 className="mb-2 font-medium">Summary</h2>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span>Items</span>
        <span>{count}</span>
      </div>
      <div className="flex items-center justify-between text-base font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <button
        onClick={() => clear()}
        className="bg-foreground text-background mt-4 inline-flex h-10 w-full items-center justify-center rounded-full px-4 text-sm font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Clear cart
      </button>
    </div>
  );
}
