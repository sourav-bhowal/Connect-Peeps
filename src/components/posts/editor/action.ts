"use server";
import { prisma } from "@/lib/prismaDB";
import { createPostSchema } from "@/lib/validations";
import { validateRequest } from "@/utils/auth";

// CREATE POST SERVER
export async function createPost(inputValues: string) {
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF NO USER
  if (!user) throw Error("Unauthorized");

  // VALIDATE POST VALUES
  const { content } = createPostSchema.parse({ content: inputValues });

  // CREATE POST
  await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  });
}
