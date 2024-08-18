"use client";
import { LikeInfo } from "@/utils/types";
import { useToast } from "../ui/use-toast";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { kyInstance } from "@/utils/ky";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

// LIKE BUTTON PROPS
interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

// LIKE BUTTON COMPONENT
export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  // Toast
  const { toast } = useToast();

  // Query client
  const queryClient = useQueryClient();

  // Query key
  const queryKey: QueryKey = ["like-info", postId];

  // Like data from use query
  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/likes/${postId}`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  // Mutate OPTIMISTICALLY
  const { mutate } = useMutation({
    // API CALL conditionally like or unlike
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/likes/${postId}`)
        : kyInstance.post(`/api/posts/likes/${postId}`),

    // OPTIMISTIC UPDATE
    onMutate: async () => {
      // toast
      toast({
        description: `Post is ${data.isLikedByUser ? "unliked" : "liked"}.`,
      })
      // Cancel any outgoing queries & get latest query
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      // Change the value in the query data manually
      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
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
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data?.likes || 0}
        <span className="hidden sm:inline"> likes</span>
      </span>
    </button>
  );
}
