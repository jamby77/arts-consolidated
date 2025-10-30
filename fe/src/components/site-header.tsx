import Link from "next/link";
import { Counter } from "./counter";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:border-white/15 dark:bg-black/40">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/products" className="text-lg font-semibold">
          Next Shop
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1 hover:underline"
          >
            <span>Cart</span>
            <Counter />
          </Link>
        </nav>
      </div>
    </header>
  );
}
