"use client";
import { useSession } from "@/app/(main)/SessionProvider";
import { FollowerInfo, UserData } from "@/utils/types";
import { PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import FollowButton from "./FollowButton";
import LinkifyLinks from "../links/LinkifyLinks";
import UserFollowerCount from "./UserFollowercount";

// TOOLTIP PROPS
interface UserToolTipProps extends PropsWithChildren {
  user: UserData;
}

// USER TOOLTIP
export default function UserToolTip({ user, children }: UserToolTipProps) {
  // get user from session
  const { user: loggedInUser } = useSession();

  // if not logged in
  if (!loggedInUser) throw new Error("Unauthorized.");

  // generate follow info
  const followInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      (follower) => follower.followerId === loggedInUser.id,
    ),
  };

  // return tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar avatarUrl={user.avatarUrl} size={48} />
              </Link>
              {loggedInUser.id !== user.id && (
                <FollowButton userId={user.id} initialState={followInfo} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <h1 className="text-lg font-bold hover:underline">
                  {user.name}
                </h1>
                <h2 className="text-muted-foreground">@{user.username}</h2>
              </Link>
              {user.bio && (
                <LinkifyLinks>
                  <p className="line-clamp-4 whitespace-pre-line">{user.bio}</p>
                </LinkifyLinks>
              )}
              <UserFollowerCount userId={user.id} initialState={followInfo} />
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
