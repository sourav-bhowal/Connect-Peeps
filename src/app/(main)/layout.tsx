import { validateRequest } from "@/utils/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import NavBar from "@/components/shared/NavBar";

// AUTH LAYOUT
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // USER FROM SESSION
  const session = await validateRequest();

  // IF USER NOT LOGGED IN
  if (!session.user) redirect("/login");

  // RETURN CHILDREN
  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </div>
    </SessionProvider>
  );
}
