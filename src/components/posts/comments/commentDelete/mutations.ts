import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteComment } from "./actions";
import { CommentData, CommentsPage } from "@/utils/types";

// MUTATION TO DELETE COMMENT
export function useDeleteCommentMutation() {
  // TOAST
  const { toast } = useToast();
  // QUERY CLIENT
  const queryClient = useQueryClient();

  // Mutation
  const mutation = useMutation({
    // delete comment fn
    mutationFn: deleteComment,
    // On success do this
    onSuccess: async (deletedComment) => {
      // query key
      const queryKey: QueryKey = ["post-comments", deletedComment.id];

      // cancel the ongoing queries
      await queryClient.cancelQueries({ queryKey });

      // set query manually
      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter(
                (comment) => comment.id !== deletedComment.id,
              ),
            })),
          };
        },
      );
      // toast
      toast({
        description: "Comment deleted successfully.",
      });
    },
    // On error do this
    onError(error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to delete comment. Try again",
      });
    },
  });

  return mutation;
}
