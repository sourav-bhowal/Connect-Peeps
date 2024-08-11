"use server";
import { prisma } from "@/lib/prismaDB";
import { createPostSchema } from "@/lib/validations";
import { validateRequest } from "@/utils/auth";
import { getPostData } from "@/utils/types";

// CREATE POST SERVER
export async function createPost(inputValues: string) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF NO USER
  if (!user) throw Error("Unauthorized");

  // VALIDATE POST VALUES
  const { content } = createPostSchema.parse({ content: inputValues });

  // CREATE POST
  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: getPostData(user.id),
  });

  return newPost;
}
