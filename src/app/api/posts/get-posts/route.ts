import { validateRequest } from "@/utils/auth";
import { prisma } from "@/lib/prismaDB";
import { PostCardDataType, PostsPage } from "@/utils/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // SEARCH PARAMS
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    // PAGE SIZE
    const pageSize = 10;

    // GET USER FROM SESSION
    const { user } = await validateRequest();

    // CHECK IF USER EXISTS
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // GET POSTS
    const posts = await prisma.post.findMany({
      include: PostCardDataType,
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    // NEXT PAGE
    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    // DATA TO RETURN
    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    // RETURN POST
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
