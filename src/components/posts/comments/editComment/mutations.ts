import { useSession } from "@/app/(main)/SessionProvider";
import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { editComment } from "./actions";
import { CommentsPage } from "@/utils/types";

// useEditCommentMutation
export function useEditCommentMutation() {
  // toast
  const { toast } = useToast();
  // query client
  const queryClient = useQueryClient();

  // mutation
  const mutation = useMutation({
    // edit comment fn
    mutationFn: editComment,

    // On success do this
    onSuccess: async (updatedComment) => {
      // filter the querys as per query key
      const queryKey: QueryKey = ["post-comments", updatedComment.postId];
      // cancel the ongoing queries
      await queryClient.cancelQueries({ queryKey });
      // update the query
      queryClient.setQueryData<InfiniteData<CommentsPage>>(
        queryKey,
        (oldData) => {
          // get the old data in callback fn
          if (!oldData) return;
          // update the old data
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.map((comment) =>
                comment.id === updatedComment.id ? updatedComment : comment,
              ),
            })),
          };
        },
      );

      // toast
      toast({
        title: "Comment updated",
        description: "Comment updated successfully.",
      });
    },

    // On error do this
    onError(error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to update comment. Try again",
      });
    },
  });

  return mutation;
}
