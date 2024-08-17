import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createComment } from "./actions";
import { CommentsPage } from "@/utils/types";

// CREATE COMMENT MUTATION
export function useCreateCommentMutation(postId: string) {
  // Toast
  const { toast } = useToast();

  // Query Client
  const queryClient = useQueryClient();

  // Mutation
  const mutation = useMutation({
    // Create the new comment
    mutationFn: createComment,

    // On success take new comment from the api and do this
    onSuccess: async (newComment) => {
      // query key
      const queryKey = ["post-comments", postId];

      // cancel the ongoing queries
      await queryClient.cancelQueries({ queryKey });

      // set query manually
      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  previousCursor: firstPage.previousCursor,
                  comments: [...firstPage.comments, newComment],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      // invalidate the queries
      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      // toast
      toast({
        title: "Comment created",
      });
    },

    // On error do this
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while creating your comment.",
        variant: "destructive",
      });
    },
  });

  // Return the mutation
  return mutation;
}
