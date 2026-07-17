"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  CloseIcon,
  DashboardIcon,
  HamburgerIcon,
  PencilIcon,
  SearchIcon,
  SignOutIcon,
} from "../shared/icons";
import Buttons from "../shared/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ConfirmDialog from "../shared/confirm-dialog";

const menuList = [
  {
    id: 1,
    label: "Articles",
    link: "/articles",
  },
  {
    id: 2,
    label: "About",
    link: "/about",
  },
];

const Navbar = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isOpen, setIsOpen] = useState(false);
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false);

  const userImage = session?.user?.image ?? null;
  const userName = session?.user?.name ?? null;
  const userEmail = session?.user?.email ?? null;
  const initial = userName
    ? userName[0].toUpperCase()
    : userEmail
      ? userEmail[0].toUpperCase()
      : "?";

  const closeDrawer = () => setIsOpen(false);
  const drawerItemClass =
    "group flex items-center gap-3 px-6 py-3 font-medium text-text-secondary hover:text-text-primary transition-colors";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-20 h-16 px-6 md:px-10 flex items-center justify-between border-b border-border-subtle bg-bg-base/80 backdrop-blur-md">
        {/* Left side */}
        <div className="flex items-center">
          <Link href="/" className="text-lg font-semibold text-text-primary">
            Knotic
          </Link>
          {/* Desktop: divider + Articles */}
          <div className="ml-6 hidden md:flex items-center font-medium gap-6">
            <span className="w-px h-4 bg-border-strong" />
            {menuList?.map((item) => (
              <Link
                key={item?.id}
                href={item?.link}
                onClick={closeDrawer}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                {item?.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side — desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/search"
            aria-label="Search"
            onClick={closeDrawer}
            className="group flex items-center justify-center gap-2 rounded-md text-text-secondary hover:text-text-primary transition-colors"
          >
            <SearchIcon
              size="16"
              className="shrink-0 fill-text-secondary group-hover:fill-text-primary"
            />
            Search
          </Link>

          {status !== "loading" &&
            (isAuthenticated ? (
              <>
                <Buttons href="/write" onClick={closeDrawer}>
                  <PencilIcon size="16" className="shrink-0" />
                  Write
                </Buttons>
                <button
                  type="button"
                  onClick={() => setIsOpen((prev) => !prev)}
                  aria-label="User avatar"
                  className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center cursor-pointer shrink-0"
                >
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName ?? "User avatar"}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-primary-muted border border-primary flex items-center justify-center text-xs font-semibold text-primary">
                      {initial}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <Buttons intent="secondary" onClick={() => signIn()}>
                Sign in
              </Buttons>
            ))}
        </div>

        {/* Right side — mobile */}
        <div className="flex md:hidden items-center gap-4">
          <Link
            href="/search"
            aria-label="Search"
            onClick={closeDrawer}
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary transition-colors"
          >
            <SearchIcon size="20" className="fill-text-secondary" />
          </Link>
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            {isOpen ? (
              <CloseIcon size="20" className="fill-text-secondary" />
            ) : (
              <HamburgerIcon size="20" className="fill-text-secondary" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        onClick={closeDrawer}
        aria-hidden="true"
        className={cn(
          "fixed top-16 right-0 bottom-0 md:bottom-auto z-30 w-full max-w-[280px] bg-bg-surface border-l md:border-b border-border-default md:rounded-bl-lg flex flex-col transition-transform duration-250 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none",
        )}
      >
        {/* User info (authenticated) */}
        {isAuthenticated && (
          <div className="px-6 py-5 border-b border-border-subtle">
            <p className="text-sm font-semibold text-text-primary truncate">
              {userName ?? "—"}
            </p>
            <p className="text-xs text-text-secondary truncate mt-0.5">
              {userEmail ?? ""}
            </p>
          </div>
        )}

        <nav aria-label="Mobile navigation" className="flex-1 py-3">
          {menuList?.map((item) => (
            <Link
              key={item?.id}
              href={item?.link}
              onClick={closeDrawer}
              className={cn(drawerItemClass, "md:hidden")}
            >
              {/* <ArticleIcon
                size="18"
                className="fill-text-secondary group-hover:fill-text-primary"
              /> */}
              {item?.label}
            </Link>
          ))}

          {status !== "loading" && isAuthenticated && (
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
            </>
          )}
        </nav>

        {/* Bottom action */}
        <div className="px-5 py-5 border-t border-border-subtle">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                closeDrawer();
                setConfirmSignOutOpen(true);
              }}
              className={cn(
                drawerItemClass,
                "w-full px-1 py-2 text-text-muted hover:text-text-secondary cursor-pointer",
              )}
            >
              <SignOutIcon
                size="18"
                className="fill-text-muted group-hover:fill-text-secondary"
              />
              Sign out
            </button>
          ) : (
            <Buttons
              onClick={() => {
                closeDrawer();
                signIn("google");
              }}
              className="w-full"
            >
              Sign in with Google
            </Buttons>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmSignOutOpen}
        title="Sign out of Knotic?"
        description="You'll need to sign in again to write or manage your articles."
        confirmLabel="Sign out"
        variant="danger"
        onConfirm={() => {
          setConfirmSignOutOpen(false);
          signOut();
        }}
        onCancel={() => setConfirmSignOutOpen(false)}
      />
    </>
  );
};

const Divider = ({ className }: { className?: string }) => (
  <div className={cn("border-t border-border-subtle my-3", className)} />
);

export default Navbar;
