import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { buildMetadata } from "@/lib/metadata";
import WriteForm from "./WriteForm";

export const metadata = buildMetadata(
  "Write",
  "Write and publish a new article on Knotic.",
);

export default async function WritePage() {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  if (!session) {
    redirect("/login");
  }

  return <WriteForm session={session} />;
}
