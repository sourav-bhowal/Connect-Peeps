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
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

// TYPE OF POST DATA
export type PostCardData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostData>;
}>;

// GET COMMENT DATA
export function getCommentData(loggedInUserId: string) {
  return {
    user: {
      select: getUserData(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

// TYPE OF COMMENT DATA
export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentData>;
}>;

// GET NOTIFICATION DATA
export const getNotificationsData = {
  issuer: {
    select: {
      username: true,
      name: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

// TYPE OF NOTIFICATION DATA
export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof getNotificationsData;
}>;

// TYPE OF NOTIFICATION PAGE
export interface NotificationPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

// POSTS PAGE TYPE
export interface PostsPage {
  posts: PostCardData[];
  nextCursor: string | null;
}

// COMMENT PAGE TYPE
export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
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

// NOTIFICATION UNREAD COUNT TYPE
export interface NotificationUnreadCount {
  unreadCount: number;
}

// STREAM MSG UNREAD COUNT TYPE
export interface StreamMessageUnreadCount {
  unreadCount: number;
}