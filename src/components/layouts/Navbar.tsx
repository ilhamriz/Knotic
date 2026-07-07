"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <nav className="z-20 fixed top-0 left-0 right-0 h-16 px-4 md:px-10 flex items-center justify-between border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      {/* Logo */}
      <Link
        href="/"
        className="text-lg font-bold text-gray-50 hover:text-white transition-colors"
      >
        Knotic
      </Link>

      {/* Nav links */}
      <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
        <li>
          <Link
            href="/articles"
            className="hover:text-gray-100 transition-colors"
          >
            Articles
          </Link>
        </li>
        <li>
          <Link
            href="/search"
            className="hover:text-gray-100 transition-colors"
          >
            Search
          </Link>
        </li>
        <li>
          <Link
            href="/features"
            className="hover:text-gray-100 transition-colors"
          >
            Features
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-gray-100 transition-colors">
            About
          </Link>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <Link
                href="/write"
                className="hover:text-gray-100 transition-colors"
              >
                Write
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="hover:text-gray-100 transition-colors"
              >
                Dashboard
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* Auth button */}
      <div>
        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-full border border-gray-700 px-4 py-1.5 text-sm font-medium text-gray-300 hover:border-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            Sign out
          </button>
        ) : (
          <button
            type="button"
            onClick={() => signIn()}
            className="rounded-full bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-400 transition-colors cursor-pointer"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
