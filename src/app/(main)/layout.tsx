import { validateRequest } from "@/utils/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import NavBar from "@/components/shared/NavBar";
import SideMenuBar from "@/components/shared/SideMenuBar";

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
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <SideMenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <SideMenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
}
