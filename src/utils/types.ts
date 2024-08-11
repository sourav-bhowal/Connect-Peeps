import { Prisma } from "@prisma/client";

// GET USER DATA
export function getUserData(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    name: true,
    avatarUrl: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

// GET POST DATA
export function getPostData(loggedInUserId: string) {
  return {
    user: {
      select: getUserData(loggedInUserId),
    },
  } satisfies Prisma.PostInclude;
}

// POST CARD DATA
export type PostCardData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostData>;
}>;

// POSTS PAGE TYPE
export interface PostsPage {
  posts: PostCardData[];
  nextCursor: string | null;
}

// FOLLOW INFO TYPE
export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}
