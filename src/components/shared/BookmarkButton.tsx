"use client";
import { BookmarkInfo } from "@/utils/types";
import { useToast } from "../ui/use-toast";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { kyInstance } from "@/utils/ky";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

// LIKE BUTTON PROPS
interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

// LIKE BUTTON COMPONENT
export default function BookmarkButton({
  postId,
  initialState,
}: BookmarkButtonProps) {
  // Toast
  const { toast } = useToast();

  // Query client
  const queryClient = useQueryClient();

  // Query key
  const queryKey: QueryKey = ["bookmark-info", postId];

  // Like data
  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/bookmarks/${postId}`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  // Mutate OPTIMISTICALLY
  const { mutate } = useMutation({
    // API CALL conditionally bookmark or unbookmark
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/bookmarks/${postId}`)
        : kyInstance.post(`/api/posts/bookmarks/${postId}`),

    // OPTIMISTIC UPDATE
    onMutate: async () => {
      // toast
      toast({
        description: `Post is ${data.isBookmarkedByUser ? "unbookmarked" : "bookmarked"}.`,
      });

      // Cancel any outgoing queries & get latest query
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      // Change the value in the query data manually
      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      // Return a context object with the snapshotted value
      return { previousState };
    },

    // ON ERROR
    onError(error, variables, context) {
      // on error not able to post
      queryClient.setQueryData(queryKey, context?.previousState);
      // console error
      console.error(error);
      // toast
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}
