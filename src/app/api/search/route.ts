import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { getPostData, PostsPage } from "@/utils/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // CURSOR
    const cursor = request.nextUrl.searchParams.get("cursor") || undefined;

    // QUERY
    const query = request.nextUrl.searchParams.get("query") || "";

    // SEARCH QUERY
    const searchQuery = query.split(" ").join(" & ");

    // PAGE SIZE
    const pageSize = 10;

    // GET USER FROM SESSION
    const { user } = await validateRequest();

    // CHECK IF USER EXISTS
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // GET SEARCH
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              search: searchQuery,
              mode: "insensitive",
            },
          },
          {
            user: {
              username: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          },
          {
            user: {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          },
        ],
      },
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

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
