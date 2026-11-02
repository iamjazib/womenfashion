import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <span className="text-xs uppercase tracking-widest font-semibold text-rose-500 mb-2">
        Page Not Found
      </span>
      <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight mb-4">
        Looking for Deals?
      </h1>
      <p className="text-neutral-500 max-w-md mb-8 text-sm">
        The page you are looking for doesn't exist or may have been moved. Return
        to explore live discounts and sales.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-neutral-950 text-white font-medium text-sm hover:bg-neutral-800 transition"
      >
        Back to Home Deals
      </Link>
    </div>
  );
}
