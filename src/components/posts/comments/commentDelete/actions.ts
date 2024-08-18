import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { getCommentData } from "@/utils/types";

// DELETE COMMENT ACTION
export async function deleteComment(commentId: string) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF NO USER
  if (!user) throw Error("Unauthorized.");

  // FIND COMMENT
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: getCommentData(user.id),
  });

  // IF NO COMMENT
  if (!comment) throw Error("Comment not found.");

  // Check if comment belongs to user
  if (comment.userId !== user.id) throw Error("unauthorized.");

  // DELETE COMMENT
  const deletedComment = await prisma.comment.delete({
    where: { id: commentId },
  });

  // RETURN
  return deletedComment;
}
