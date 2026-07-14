import Link from "next/link";

export default function NotFound() {
  return (
    <main className="py-20 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-text-secondary mt-2">
        The page you are looking for does not exist.
      </p>

      <Link href="/" className="inline-block mt-6 text-primary">
        Back to home
      </Link>
    </main>
  );
}
