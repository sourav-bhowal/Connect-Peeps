import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { getPostData, PostsPage } from "@/utils/types";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    // SEARCH PARAMS
    const cursor = request.nextUrl.searchParams.get("cursor") || undefined;

    // PAGE SIZE
    const pageSize = 10;

    // GET USER FROM SESSION
    const { user } = await validateRequest();

    // CHECK IF USER EXISTS
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // GET USER POSTS
    const posts = await prisma.post.findMany({
      where: { userId: params.userId },
      include: getPostData(user.id),
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
