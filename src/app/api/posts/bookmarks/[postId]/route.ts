import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { BookmarkInfo} from "@/utils/types";

// GET THE BOOKMARK
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

    // Get bookmark
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId,
        },
      },
    });

    // Data
    const data: BookmarkInfo = {
      isBookmarkedByUser: !!bookmark,
    };

    // Return data
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// CREATE BOOKMARK
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
    await prisma.bookmark.upsert({
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

// DELETE BOOKMARK
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
    await prisma.bookmark.deleteMany({
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
