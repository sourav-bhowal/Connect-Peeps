import { Prisma } from "@prisma/client";

// GET USER DATA
export function getUserData(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    name: true,
    bio: true,
    createdAt: true,
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
        post: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

// TYPE OF USER DATA
export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserData>;
}>;

// GET POST DATA
export function getPostData(loggedInUserId: string) {
  return {
    user: {
      select: getUserData(loggedInUserId),
    },
    media: true,
    likes: {
      where: {
        userId: loggedInUserId,
      },
      // we want the user id
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      // we want the user id
      select: {
        userId: true,
      },
    },
    // get count of likes
    _count: {
      select: {
        likes: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

// TYPE OF POST DATA
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

// LIKE INFO TYPE
export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

// BOOKMARK INFO TYPE
export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}
