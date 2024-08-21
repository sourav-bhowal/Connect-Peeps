import Link from "next/link";
import { Button } from "../ui/button";
import { Bookmark, Home } from "lucide-react";
import { validateRequest } from "@/utils/auth";
import { prisma } from "@/lib/prismaDB";
import NotificationsButton from "./NotificationsButton";
import UnreadStreamMessagesCountButton from "@/app/(main)/messages/UnreadMessagesCountButton";
import streamServer from "@/lib/stream";

// TYPE OF SIDEBAR
interface SideMenuBarProps {
  className?: string;
}

// SIDEBAR CONTAINER
export default async function SideMenuBar({ className }: SideMenuBarProps) {
  // get user
  const { user: loggedInUser } = await validateRequest();

  // if no user
  if (!loggedInUser) return null;

  // DO ALL PROMISES
  const [unreadNotifications, unreadStreamMessagesCount] = await Promise.all([
    // count unread notifications
    prisma.notification.count({
      where: {
        recipientId: loggedInUser.id,
        read: false,
      },
    }),
    // count unread messages stream
    (await streamServer.getUnreadCount(loggedInUser.id))?.total_unread_count,
  ]);

  return (
    <section className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      {/* NOTIFICATIONS */}
      <NotificationsButton
        initialState={{
          unreadCount: unreadNotifications,
        }}
      />
      {/* MESSAGES */}
      <UnreadStreamMessagesCountButton
        initialState={{
          unreadCount: unreadStreamMessagesCount,
        }}
      />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </section>
  );
}
