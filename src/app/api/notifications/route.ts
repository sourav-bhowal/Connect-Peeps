// GET ROUTE FOR NOTIFICATIONS

import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { getNotificationsData, NotificationPage } from "@/utils/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
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

    // GET NOTIFICATIONS
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: getNotificationsData,
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    // NEXT PAGE
    const nextCursor =
      notifications.length > pageSize ? notifications[pageSize].id : null;

    // DATA TO RETURN
    const data: NotificationPage = {
      notifications: notifications.slice(0, pageSize),
      nextCursor,
    };

    // RETURN DATA
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
