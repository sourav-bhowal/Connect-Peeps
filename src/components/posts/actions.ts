"use server";
import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { getPostData, } from "@/utils/types";

export async function deletePost(id: string) {
  // take user from session
  const { user } = await validateRequest();

  // if no user
  if (!user) throw new Error("Unauthorized.");

  // find post
  const post = await prisma.post.findUnique({
    where: { id },
  });

  // if no post
  if (!post) throw new Error("Post not found.");

  // if post user id and current user id not match
  if (post.userId !== user.id) throw new Error("unauthorized");

  // delete post
  const deletedPost = await prisma.post.delete({
    where: { id },
    include: getPostData(user.id),
  });

  return deletedPost;
}
