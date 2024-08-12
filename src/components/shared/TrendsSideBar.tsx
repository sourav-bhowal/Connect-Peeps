import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { getUserData } from "@/utils/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "../ui/button";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/utils/topicsCount";
import FollowButton from "./FollowButton";
import UserToolTip from "./UserToolTip";

// TRENDS BAR
export default function TrendsSideBar() {
  return (
    <section className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      {/* Suspence helps to load the component itself without blocking the ui */}
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </section>
  );
}

// WHO TO FOLLOW SERVER FUNCTION AND COMPONENT
async function WhoToFollow() {
  // TAKE USER FROM SESSION
  const { user } = await validateRequest();

  // NOT FOLLOWING PEEPS
  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user?.id,
      },
      followers: {
        none: {
          followerId: user?.id,
        },
      },
    },
    select: getUserData(user?.id as string),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-md">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserToolTip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.name}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
          </UserToolTip>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                (follower) => follower.followerId === user.id,
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}

// CACHING FUNCTION FOR DB CALL
const getTrendingTopics = unstable_cache(
  async () => {
    const topics = await prisma.$queryRaw<{ hastag: string; count: bigint }[]>`
    SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hastag, COUNT(*) AS count FROM posts GROUP BY (hastag) ORDER BY count DESC, hastag ASC LIMIT 5
    `;

    return topics.map((row) => ({
      hastag: row.hastag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

// TRENDING TOPICS SERVER FUNCTION & COMPONENT
async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trendingTopics.map(({ hastag, count }) => {
        const title = hastag.split("#")[1];

        return (
          <Link key={title} href={`/hastag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hastag}
            >
              {hastag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
