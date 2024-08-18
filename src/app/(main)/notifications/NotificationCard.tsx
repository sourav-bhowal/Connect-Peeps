import UserAvatar from "@/components/shared/UserAvatar";
import { cn } from "@/lib/utils";
import { NotificationData } from "@/utils/types";
import { NotificationType } from "@prisma/client";
import { Heart, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";

// PROPS
interface NotificationCardProps {
  notification: NotificationData;
}

// NOTIFICATION CARD COMPONENT
export default function NotificationCard({
  notification,
}: NotificationCardProps) {
  // NOTIFICATION MAPPING
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: ` ${notification.issuer.name} started following you`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    LIKE: {
      message: ` ${notification.issuer.name} liked your post`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      href: `/posts/${notification.postId}`,
    },
    COMMENT: {
      message: ` ${notification.issuer.name} commented on your post`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      href: `/posts/${notification.postId}`,
    },
  };

  // Destructure data from notification
  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div>
            <span className="font-bold">{notification.issuer.name}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
