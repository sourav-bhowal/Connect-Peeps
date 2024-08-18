"use client";
import PostsLodingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import InfiniteScrollContainer from "@/components/shared/InfiniteScrollContainer";
import { kyInstance } from "@/utils/ky";
import { NotificationPage, PostsPage } from "@/utils/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import NotificationCard from "./NotificationCard";
import { useEffect } from "react";

export default function MyNotifications() {
  // GET POSTS USING REACT QUERY INFINTE SCROLL
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // query client
  const queryClient = useQueryClient();

  // mark notifications as read mutation
  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch("/api/notifications/mark-as-read"),
    // set unread count to 0
    onSuccess: () => {
      queryClient.setQueryData(["notification-unread-count"], {
        unreadCount: 0,
      });
    },
    // on error
    onError: (error) => {
      console.error(
        "An error occurred while marking notifications as read.",
        error,
      );
    },
  });

  // Mark Read on mount
  useEffect(() => {
    mutate();
  }, [mutate]);

  // flat map the notifications
  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  // RENDERING POSTS
  if (status === "pending") {
    return <PostsLodingSkeleton />;
  }

  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No notifications found.
      </p>
    );
  }

  // IF THERE IS AN ERROR
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading notifications.
      </p>
    );
  }

  // RENDER NOTIFICATIONS
  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
