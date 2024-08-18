"use server";
import { prisma } from "@/lib/prismaDB";
import { updatePostSchema } from "@/lib/validations";
import { validateRequest } from "@/utils/auth";
import { getPostData } from "@/utils/types";

// TYPE OF POST DATA
export type EditPostData = {
  postId: string;
  content: string;
};

// Edit POST SERVER
export async function editPost({ postId, content }: EditPostData) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();
  // IF NO USER
  if (!user) throw Error("Unauthorized.");

  // FIND POST
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  // IF NO POST
  if (!post) throw Error("Post not found.");

  // Check if post belongs to user
  if (post.userId !== user.id) throw Error("unauthorized.");

  // VALIDATE POST VALUES
  const { content: contentValidated } = updatePostSchema.parse({ content });

  // UPDATE POST
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { content: contentValidated },
    include: getPostData(user.id),
  });

  // RETURN POST
  return updatedPost;
}
