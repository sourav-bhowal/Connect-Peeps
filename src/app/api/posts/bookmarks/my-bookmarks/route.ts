import { validateRequest } from "@/utils/auth";
import { prisma } from "@/lib/prismaDB";
import { getPostData, PostsPage } from "@/utils/types";
import { NextRequest } from "next/server";

// GET BOOKMARKED POSTS
export async function GET(req: NextRequest) {
  try {
    // SEARCH PARAMS
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    // PAGE SIZE
    const pageSize = 10;

    // GET USER FROM SESSION
    const { user } = await validateRequest();
    // console.log(user);

    // CHECK IF USER EXISTS
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // GET BOOKMARKED POSTS
    const bookmarkedPosts = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
          include: getPostData(user.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    // NEXT PAGE
    const nextCursor =
      bookmarkedPosts.length > pageSize ? bookmarkedPosts[pageSize].id : null;

    // DATA TO RETURN
    const data: PostsPage = {
      // return post data inside the bookmark
      posts: bookmarkedPosts
        .slice(0, pageSize)
        .map((bookmark) => bookmark.post),
      nextCursor,
    };
    // console.log(data);

    // RETURN POST
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
