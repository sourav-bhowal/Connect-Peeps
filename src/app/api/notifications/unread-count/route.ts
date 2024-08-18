import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";
import { NotificationUnreadCount } from "@/utils/types";

// GET ROUTE FOR NOTIFICATIONS UNREAD COUNT
export async function GET() {
  try {
    // get user
    const { user: loggedInUser } = await validateRequest();

    // if not logged in
    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    // get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: loggedInUser.id,
        read: false,
      },
    });

    // return data
    const data: NotificationUnreadCount = {
      unreadCount,
    };

    // return data
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
