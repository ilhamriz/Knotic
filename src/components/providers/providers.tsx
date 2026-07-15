"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Toaster } from "sonner";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Toaster theme="dark" position="bottom-center" richColors />
      {children}
    </SessionProvider>
  );
};

export default Providers;
