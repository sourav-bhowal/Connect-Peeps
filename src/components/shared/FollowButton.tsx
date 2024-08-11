"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/utils/types";
import { useToast } from "../ui/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { kyInstance } from "@/utils/ky";

// FOLLOW BUTTON PROPS
interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

// FOLLOW BUTTON Fn
export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  // Follow data
  const { data } = useFollowerInfo(userId, initialState);
  // toast
  const { toast } = useToast();
  // query client
  const queryClient = useQueryClient();
  // query key
  const queryKey: QueryKey = ["follower-info", userId];
  // mutate
  const { mutate } = useMutation({
    // API CALL
    mutationFn: () => {
      if (data.isFollowedByUser) {
        return kyInstance.delete(`/api/users/${userId}/followers`);
      } else {
        return kyInstance.post(`/api/users/${userId}/followers`);
      }
    },
    // OPTIISTIC UPADTE
    onMutate: async () => {
      // cancel any outgoing queries & get latest query
      await queryClient.cancelQueries({ queryKey });
      // snapshot previous value
      const previousData = queryClient.getQueryData<FollowerInfo>(queryKey);
      // change the value
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousData?.followers || 0) +
          (previousData?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousData?.isFollowedByUser,
      }));
      // return a context object with the snapshotted value
      return { previousData };
    },
    // ON ERROR
    onError(error, variables, context) {
      // on error not able to post 
      queryClient.setQueryData(queryKey, context?.previousData);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
