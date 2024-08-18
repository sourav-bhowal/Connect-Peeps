import { prisma } from "@/lib/prismaDB";
import { validateRequest } from "@/utils/auth";

export async function PATCH() {
  try {
    // get user
    const { user: loggedInUser } = await validateRequest();

    // if not logged in
    if (!loggedInUser) {
      throw new Error("Unauthorized");
    }

    // mark notifications as read
    await prisma.notification.updateMany({
      where: {
        recipientId: loggedInUser.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    // return success
    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
