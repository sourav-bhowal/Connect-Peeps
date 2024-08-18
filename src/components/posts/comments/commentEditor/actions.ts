"use server";
import { prisma } from "@/lib/prismaDB";
import { createCommentSchema } from "@/lib/validations";
import { validateRequest } from "@/utils/auth";
import { getCommentData, PostCardData } from "@/utils/types";

// TYPE OF COMMENT DATA
interface CommentData {
  post: PostCardData;
  content: string;
}

// CREATE COMMENT SERVER ACTION
export async function createComment({ post, content }: CommentData) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF NO USER
  if (!user) throw Error("Unauthorized");

  // VALIDATE COMMENT VALUES
  const { content: contentValidated } = createCommentSchema.parse({ content });

  // create transaction
  const [newComment] = await prisma.$transaction([
    // CREATE COMMENT
    prisma.comment.create({
      data: {
        content: contentValidated,
        userId: user.id,
        postId: post.id,
      },
      include: getCommentData(user.id),
    }),

    // send notification
    ...(post.user.id !== user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.user.id,
              postId: post.id,
              type: "COMMENT",
            },
          }),
        ]
      : []),
  ]);

  // RETURN POST
  return newComment;
}
