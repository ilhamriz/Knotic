"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArticleIcon,
  CloseIcon,
  DashboardIcon,
  HamburgerIcon,
  PencilIcon,
  SearchIcon,
  SignOutIcon,
} from "../shared/icons";
import Buttons from "../shared/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isOpen, setIsOpen] = useState(false);

  const initial = session?.user?.name
    ? session.user.name[0].toUpperCase()
    : session?.user?.email
      ? session.user.email[0].toUpperCase()
      : null;

  const closeDrawer = () => setIsOpen(false);
  const drawerItemClass =
    "group flex items-center gap-3 px-6 py-3 font-medium text-text-secondary hover:text-text-primary transition-colors";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-20 h-16 px-6 md:px-10 flex items-center justify-between border-b border-border-subtle bg-bg-elevated backdrop-blur-md">
        {/* Left side */}
        <div className="flex items-center">
          <Link
            href="/"
            className="text-lg font-semibold text-text-primary hover:text-primary transition-colors"
          >
            Knotic
          </Link>
          {/* Desktop: divider + Articles */}
          <div className="hidden md:flex items-center font-medium">
            <span className="w-px h-4 bg-border-strong mx-4" />
            <Link
              href="/articles"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Articles
            </Link>
          </div>
        </div>

        {/* Right side — desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/search"
            aria-label="Search"
            className="group flex items-center justify-center gap-2 rounded-md text-text-secondary hover:text-text-primary transition-colors"
          >
            <SearchIcon
              size="16"
              className="shrink-0 fill-text-secondary group-hover:fill-text-primary"
            />
            Search
          </Link>

          {status === "loading" ? null : isAuthenticated ? (
            <>
              <Buttons href="/write">
                <PencilIcon size="16" className="shrink-0" />
                Write
              </Buttons>
              <span className="w-px h-4 bg-border-strong mx-1" />
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-8 h-8 rounded-full bg-primary-muted border border-primary flex items-center justify-center text-xs font-semibold text-primary cursor-pointer"
              >
                {initial}
              </button>
            </>
          ) : (
            <Buttons intent="secondary" onClick={() => signIn()}>
              Sign in
            </Buttons>
          )}
        </div>

        {/* Right side — mobile */}
        <div className="flex md:hidden items-center gap-4">
          <Link
            href="/search"
            aria-label="Search"
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary transition-colors"
          >
            <SearchIcon className="fill-text-secondary" />
          </Link>
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            {isOpen ? (
              <CloseIcon className="fill-text-secondary" />
            ) : (
              <HamburgerIcon className="fill-text-secondary" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed top-16 right-0 z-10 w-full max-w-[250px] bg-bg-elevated border-l border-border-default rounded-bl-lg">
          <nav aria-label="Mobile navigation" className="py-4">
            <Link
              href="/articles"
              onClick={closeDrawer}
              className={cn(drawerItemClass, "md:hidden")}
            >
              <ArticleIcon
                size="18"
                className="fill-text-secondary group-hover:fill-text-primary"
              />
              Articles
            </Link>

            {status !== "loading" && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/write"
                      onClick={closeDrawer}
                      className={cn(drawerItemClass, "md:hidden")}
                    >
                      <PencilIcon
                        size="18"
                        className="fill-text-secondary group-hover:fill-text-primary"
                      />
                      Write
                    </Link>

                    <Divider className="md:hidden" />

                    <Link
                      href="/dashboard"
                      onClick={closeDrawer}
                      className={drawerItemClass}
                    >
                      <DashboardIcon
                        size="18"
                        className="fill-text-secondary group-hover:fill-text-primary"
                      />
                      Dashboard
                    </Link>

                    <Divider />

                    <button
                      type="button"
                      onClick={() => {
                        closeDrawer();
                        signOut();
                      }}
                      className={cn(
                        drawerItemClass,
                        "w-full text-text-muted hover:text-text-secondary cursor-pointer",
                      )}
                    >
                      <SignOutIcon
                        size="18"
                        className="fill-text-muted group-hover:fill-text-secondary"
                      />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Divider />
                    <div className="px-6 py-2">
                      <Buttons
                        intent="secondary"
                        onClick={() => {
                          closeDrawer();
                          signIn();
                        }}
                        className="w-full"
                      >
                        Sign in
                      </Buttons>
                    </div>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

const Divider = ({ className }: { className?: string }) => (
  <div className={cn("border-t border-border-default mx-6 my-3", className)} />
);

export default Navbar;
