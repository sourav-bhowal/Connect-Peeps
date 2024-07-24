import { Prisma } from "@prisma/client";

// POST CARD DATA TYPES
export const PostCardDataType = {
  user: {
    select: {
      username: true,
      name: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.PostInclude;

// POST CARD DATA
export type PostCardData = Prisma.PostGetPayload<{
  include: typeof PostCardDataType;
}>;
