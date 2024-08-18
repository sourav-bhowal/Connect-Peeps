"use client";
import { NotificationUnreadCount } from "@/utils/types";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { kyInstance } from "@/utils/ky";

// TYPE OF NOTIFICATION UNREAD COUNT
interface NotificationsButtonProps {
  initialState: NotificationUnreadCount;
}

// NOTIFICATIONS BUTTON
export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  // NOTIFICATION UNREAD COUNT QUERY
  const { data } = useQuery({
    queryKey: ["notification-unread-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationUnreadCount>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell />
          {!!data?.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
}
