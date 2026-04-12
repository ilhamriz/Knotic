import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import WriteForm from "./WriteForm";

export default async function WritePage() {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  if (!session) {
    redirect("/login");
  }

  return <WriteForm session={session} />;
}
