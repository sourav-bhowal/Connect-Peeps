"use server";
import { prisma } from "@/lib/prismaDB";
import { createPostSchema } from "@/lib/validations";
import { validateRequest } from "@/utils/auth";
import { getPostData } from "@/utils/types";
import { UTApi } from "uploadthing/server";

// CREATE POST SERVER
export async function createPost(inputValues: {
  content: string;
  mediaIds: string[];
}) { 
  // GET USER FROM SESSION
  const { user } = await validateRequest();

  // IF NO USER
  if (!user) throw Error("Unauthorized");

  // VALIDATE POST VALUES
  const { content, mediaIds } = createPostSchema.parse(inputValues);

  // CREATE POST
  const newPost = await prisma.post.create({
    data: {
      content,
      // connect media to post
      media: {
        connect: mediaIds.map((mediaId) => ({ id: mediaId })),
      },
      userId: user.id,
    },
    include: getPostData(user.id),
  });

  // If no post delete media files
  if (!newPost) {
    mediaIds.map(async (mediaId) => {
      const deletedMedia = await prisma.media.delete({
        where: { id: mediaId },
      });

      // Delete the media files from uploadthing
      if (deletedMedia) {
        const key = deletedMedia.url.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];
        await new UTApi().deleteFiles(key);
      }
    });
  }

  // RETURN POST
  return newPost;
}
