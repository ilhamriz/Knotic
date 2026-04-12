"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 px-4 md:px-10 flex justify-between items-center">
      <h2>Knotic</h2>
      <ul className="flex gap-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/features">Features</Link>
        </li>
        <li>
          <Link href="/articles">Articles</Link>
        </li>
        <li>
          <Link href="/search">Search</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
      </ul>

      <div className="">
        {status === "authenticated" ? (
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-white text-black"
            onClick={() => signOut()}
          >
            Logout
          </button>
        ) : (
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-white text-black"
            onClick={() => signIn()}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
