import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { CommentsPage, getCommentData } from "@/utils/types";
import { NextRequest } from "next/server";

// GET COMMENTS ROUTE
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    // SEARCH PARAMS
    const cursor = request.nextUrl.searchParams.get("cursor") || undefined;

    // PAGE SIZE
    const pageSize = 6;

    // GET USER FROM SESSION
    const { user } = await validateRequest();

    // CHECK IF USER EXISTS
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // FETCH COMMENTS
    const comments = await prisma.comment.findMany({
      where: { postId: params.postId },
      include: getCommentData(user.id),
      orderBy: { createdAt: "asc" },
      take: -pageSize - 1, // paginate in opposite direction
      cursor: cursor ? { id: cursor } : undefined,
    });

    // PREVIOUS PAGE
    const previousCursor = comments.length > pageSize ? comments[0].id : null;

    // COMMENTS DATA
    const data: CommentsPage = {
      comments: comments.length > pageSize ? comments.slice(1) : comments,
      previousCursor,
    };

    // RETURN DATA
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
