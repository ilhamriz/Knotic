// app/(public)/login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [router, status]);

  return (
    <main className="px-4 md:px-10 py-10 max-w-3xl mx-auto text-center">
      <div className="rounded-3xl border border-border-default bg-bg-surface p-10">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Sign in to Knotic
        </h1>
        <p className="text-text-secondary mb-8">
          Sign in with Google to publish articles and manage your dashboard.
        </p>

        {status === "loading" ? (
          <p className="text-text-secondary">Checking your session...</p>
        ) : session?.user ? (
          <div className="space-y-4">
            <p className="text-text-primary">
              Signed in as {session.user.name ?? session.user.email}
            </p>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full bg-danger px-6 py-3 text-sm font-semibold text-white hover:bg-danger-hover"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => signIn("google")}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Continue with Google
          </button>
        )}
      </div>
    </main>
  );
}
