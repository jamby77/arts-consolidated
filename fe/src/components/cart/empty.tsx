import Link from "next/link";

export function Empty() {
  return (
    <div className="text-zinc-700 dark:text-zinc-300">
      Your cart is empty.{" "}
      <Link href="/products" className="underline">
        Continue shopping
      </Link>
      .
    </div>
  );
}
