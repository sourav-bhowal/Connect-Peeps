import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { userData } from "@/utils/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "../ui/button";

// TRENDS BAR
export default function TrendsSideBar() {
  return (
    <section className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
        {/* Suspence helps to load the component itself without blocking the ui */}
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow /> 
      </Suspense>
    </section>
  );
}

// WHO TO FOLLOW SERVER FUNCTION
async function WhoToFollow() {
  // TAKE USER FROM SESSION
  const { user } = await validateRequest();

  // NOT FOLLOWING PEEPS
  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user?.id,
      },
    },
    select: userData,
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-md">
      <div className="text-xl font-bold">Who to follow</div>
      {
        usersToFollow.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3">
                <Link href={`/users/${user.username}`} className="flex items-center gap-3">
                    <UserAvatar avatarUrl={user.avatarUrl} className="flex-none"/>
                    <div>
                        <p className="line-clamp-1 break-all font-semibold hover:underline">{user.name}</p>
                        <p className="line-clamp-1 break-all text-muted-foreground">@{user.username}</p>
                    </div>
                </Link>
                <Button>Follow</Button>
            </div>
        ))
      }
    </div>
  );
}
