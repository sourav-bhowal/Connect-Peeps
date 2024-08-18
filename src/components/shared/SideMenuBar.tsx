import Link from "next/link";
import { Button } from "../ui/button";
import { Bookmark, Home, MessageCircle } from "lucide-react";
import { validateRequest } from "@/utils/auth";
import { prisma } from "@/lib/prismaDB";
import NotificationsButton from "./NotificationsButton";

// TYPE OF SIDEBAR
interface SideMenuBarProps {
  className?: string;
}

export default async function SideMenuBar({ className }: SideMenuBarProps) {
  // get user
  const { user: loggedInUser } = await validateRequest();

  // if no user
  if (!loggedInUser) return null;

  // get unread notification
  const unreadNotifications = await prisma.notification.count({
    where: {
      recipientId: loggedInUser.id,
      read: false,
    },
  });
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
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Messages"
        asChild
      >
        <Link href="/messages">
          <MessageCircle />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>
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
