// Edit post mutation
import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { editPost } from "./actions";
import { useSession } from "@/app/(main)/SessionProvider";
import { PostsPage } from "@/utils/types";

export function useEditPostMutation() {
  // toast
  const { toast } = useToast();
  // query client
  const queryClient = useQueryClient();
  // Logged in user
  const { user } = useSession();

  // mutation
  const mutation = useMutation({
    // edit post fn
    mutationFn: editPost,

    // On success do this
    onSuccess: async (updatedPost) => {
      // filter the querys as per query key
      const queryFilter = {
        queryKey: ["post-feed"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user?.id))
          );
        },
      } satisfies QueryFilters;

      // cancel the ongoing queries
      await queryClient.cancelQueries(queryFilter);

      // set query manually
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          // get the old data in callback fn
          if (!oldData) return;

          // update the old data
          return {
            pageParams: oldData.pageParams, // page params will be same as oldData params
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map(
                (
                  post, // put the updated post in the desired place in the post list
                ) => (post.id === updatedPost.id ? updatedPost : post),
              ),
            })),
          };
        },
      );

      // toast
      toast({
        title: "Post updated",
        description: "Your post has been updated.",
      });
    },

    // On error do this
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while updating your post.",
        variant: "destructive",
      });
    },
  });

  return mutation;
}
