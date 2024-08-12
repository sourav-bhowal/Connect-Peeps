import FollowButton from "@/components/shared/FollowButton";
import TrendsSideBar from "@/components/shared/TrendsSideBar";
import UserAvatar from "@/components/shared/UserAvatar";
import UserFollowerCount from "@/components/shared/UserFollowercount";
import UserFollowercount from "@/components/shared/UserFollowercount";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { formatNumber } from "@/utils/topicsCount";
import { FollowerInfo, getUserData, UserData } from "@/utils/types";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPostsFeed from "./UserPostsFeed";
import LinkifyLinks from "@/components/links/LinkifyLinks";

// User Page Props
interface UserPageProps {
  params: {
    username: string;
  };
}

// Fetch User Data from cache
const fetchUser = cache(async (username: string, loggedInUserId: string) => {
  // get user
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserData(loggedInUserId),
  });

  // if user not found
  if (!user) notFound();
  // return user
  return user;
});

// Generate Meta Data for User Page
export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  // get logged in user
  const { user: loggedInUser } = await validateRequest();
  // if not logged in
  if (!loggedInUser) return {};
  // get user
  const user = await fetchUser(params.username, loggedInUser.id);
  // if user
  return {
    title: `@${user.username}`,
  };
}

// User profile props
interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

// User Profile Component
async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      (follower) => follower.followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <p>Member since {formatDate(user.createdAt, "MMMM d, yyyy")}</p>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.post)}
              </span>
            </span>
            <UserFollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Edit Profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <LinkifyLinks>
            <p className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </p>
          </LinkifyLinks>
        </>
      )}
    </div>
  );
}

// User Page Component
export default async function UserPage({ params }: UserPageProps) {
  // get logged in user
  const { user: loggedInUser } = await validateRequest();

  // if not logged in
  if (!loggedInUser)
    return <p className="text-destructive">You need to be logged in</p>;

  // get user
  const user = await fetchUser(params.username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        {/* User Profile Component of User */}
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.username}&apos;s posts
          </h2>
        </div>
        {/* Posts Feed Component of User */}
        <UserPostsFeed userId={user.id} />
      </div>
      {/* Trends Side Bar */}
      <TrendsSideBar />
    </main>
  );
}
