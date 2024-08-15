"use server";
import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { getPostData } from "@/utils/types";
import { UTApi } from "uploadthing/server";

export async function deletePost(id: string) {
  // Take user from session
  const { user } = await validateRequest();

  // If no user
  if (!user) throw new Error("Unauthorized.");

  // Find post
  const post = await prisma.post.findUnique({
    where: { id },
  });

  // If no post
  if (!post) throw new Error("Post not found.");

  // If post user id and current user id not match
  if (post.userId !== user.id) throw new Error("unauthorized");

  // delete post
  const deletedPost = await prisma.post.delete({
    where: { id },
    include: getPostData(user.id),
  });

  // Delete the media files of the post
  if (deletedPost) {
    // Delete media files
    deletedPost.media.map(async (media) => {
      const deletedMedia = await prisma.media.delete({ where: { id: media.id } });

      // Delete the media files from uploadthing
      if (deletedMedia) {
        // Delete media files from uploadthing
        const key = deletedMedia.url
          .split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1];
        await new UTApi().deleteFiles(key);
      }
    });
  }

  return deletedPost;
}
