import { Prisma } from "@prisma/client";

// USER DATA
export const userData = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

// POST CARD DATA TYPES
export const PostCardDataType = {
  user: {
    select: userData,
  },
} satisfies Prisma.PostInclude;

// POST CARD DATA
export type PostCardData = Prisma.PostGetPayload<{
  include: typeof PostCardDataType;
}>;


// POSTS PAGE TYPE
export interface PostsPage {
  posts: PostCardData[];
  nextCursor: string | null;
}