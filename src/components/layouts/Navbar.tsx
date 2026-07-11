"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 h-16 px-6 md:px-10 flex items-center justify-between border-b border-border-subtle bg-bg-elevated backdrop-blur-md">
      {/* Wordmark */}
      <Link
        href="/"
        className="text-lg font-semibold text-text-primary hover:text-primary transition-colors"
      >
        Knotic
      </Link>

      {/* Center nav links */}
      <ul className="hidden md:flex items-center gap-6">
        <li>
          <Link
            href="/articles"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Articles
          </Link>
        </li>
        <li>
          <Link
            href="/search"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Search
          </Link>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <Link
                href="/write"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Write
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Dashboard
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* Auth button */}
      <div>
        {status === "loading" ? null : isAuthenticated ? (
          <button
            type="button"
            onClick={() => signOut()}
            className="text-sm font-medium px-4 py-1.5 rounded-full border border-border-strong text-text-primary hover:bg-bg-surface transition-colors cursor-pointer"
          >
            Sign out
          </button>
        ) : (
          <button
            type="button"
            onClick={() => signIn()}
            className="text-sm font-medium px-4 py-1.5 rounded-full border border-border-strong text-text-primary hover:bg-bg-surface transition-colors cursor-pointer"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
