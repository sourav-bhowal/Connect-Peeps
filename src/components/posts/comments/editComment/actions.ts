"use server";
import { prisma } from "@/lib/prismaDB";
import { createCommentSchema } from "@/lib/validations";
import { validateRequest } from "@/utils/auth";
import { getCommentData } from "@/utils/types";

// TYPE OF COMMENT DATA
export type EditCommentData = {
  commentId: string;
  content: string;
};

// Edit POST SERVER
export async function editComment({ commentId, content }: EditCommentData) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();
  // IF NO USER
  if (!user) throw Error("Unauthorized.");

  // FIND COMMENT
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  // IF NO COMMENT
  if (!comment) throw Error("Post not found.");

  // Check if comment belongs to user
  if (comment.userId !== user.id) throw Error("unauthorized.");

  // VALIDATE COMMENT VALUES
  const { content: contentValidated } = createCommentSchema.parse({ content });

  // UPDATE COMMENT
  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content: contentValidated },
    include: getCommentData(user.id),
  });

  // RETURN COMMENT
  return updatedComment;
}
