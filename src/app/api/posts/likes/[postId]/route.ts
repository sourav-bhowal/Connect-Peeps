import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { LikeInfo } from "@/utils/types";

// GET THE LIKES
export async function GET(
  request: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    // get user
    const { user: loggedInUser } = await validateRequest();
    // if not logged in
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        // get likes from post if the user is logged in user
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          // we want the user id
          select: {
            userId: true,
          },
        },
        // get count of likes
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    // If post not found
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    // Data to return
    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
    };

    // Return data
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// CREATE LIKE
export async function POST(
  request: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    // get user
    const { user: loggedInUser } = await validateRequest();
    // if not logged in
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // upsert will create a like if u dont like otherwise ignore it
    await prisma.like.upsert({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId,
        },
      },
      create: {
        userId: loggedInUser.id,
        postId,
      },
      update: {},
    });

    // Return success
    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE LIKE
export async function DELETE(
  request: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    // get user
    const { user: loggedInUser } = await validateRequest();
    // if not logged in
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // delete like
    await prisma.like.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId,
      },
    });

    // Return success
    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
