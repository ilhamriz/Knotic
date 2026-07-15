// app/(public)/login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { GoogleIcon } from "@/components/shared/icons";
import Buttons from "@/components/shared/button";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [router, status]);

  return (
    <main className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
      <div className="rounded-2xl border border-border-default bg-bg-surface p-8 md:p-10 max-w-md w-full shadow-lg">
        {/* Wordmark */}
        <div className="text-center mb-6">
          <span className="text-lg font-semibold text-text-primary">
            Knotic
          </span>
        </div>

        {status !== "loading" && !session?.user ? (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-2">
              Sign in to Knotic
            </h1>
            <p className="text-text-secondary text-center mb-8">
              Sign in with Google to publish articles and manage your dashboard.
            </p>
          </>
        ) : null}

        {status === "loading" ? (
          <p className="text-text-secondary text-sm text-center">
            Checking your session...
          </p>
        ) : session?.user ? (
          <div className="flex flex-col items-center gap-4">
            {/* Avatar circle with initial */}
            <div className="w-10 h-10 rounded-full bg-bg-elevated border border-border-default flex items-center justify-center text-sm font-semibold text-text-primary select-none">
              {(session.user.name ??
                session.user.email ??
                "?")[0].toUpperCase()}
            </div>
            <p className="text-text-secondary text-sm text-center">
              Signed in as{" "}
              <span className="text-text-primary font-medium">
                {session.user.name ?? session.user.email}
              </span>
            </p>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full rounded-full bg-danger hover:bg-danger-hover text-text-primary px-6 py-3 text-sm font-semibold transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Buttons
            intent="secondary"
            onClick={() => signIn("google")}
            className="h-auto! py-3 gap-3"
          >
            <GoogleIcon size="20" />
            Continue with Google
          </Buttons>
        )}
      </div>
    </main>
  );
}
