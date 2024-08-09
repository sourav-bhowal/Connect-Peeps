import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createPost } from "./action";
import { PostsPage } from "@/utils/types";

export function usePostSubmitMutation() {
  // TOAST
  const { toast } = useToast();

  // QUERY CLIENT
  const queryClient = useQueryClient();

  // MUTATION
  const mutation = useMutation({
    // Create the new post
    mutationFn: createPost,
    // On success do this
    onSuccess: async (newPost) => {
      // take the new post

      // filter the posts as per query key
      const queryFilter: QueryFilters = { queryKey: ["post-feed", "for-you"] };
      // cancel the ongoing queries
      await queryClient.cancelQueries(queryFilter);
      // set query manually
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          // get the old data in callback fn
          // take the first page
          const firstPage = oldData?.pages[0];
          // if first page
          if (firstPage) {
            // show the old posts with the new post at top the logic below
            return {
              pageParams: oldData.pageParams, // page params will be same as oldData params
              pages: [
                // pages will be modified as per our need
                {
                  posts: [newPost, ...firstPage.posts], // show new post first then the old posts
                  nextCursor: firstPage.nextCursor, // cursor should be the same
                },
                ...oldData.pages.slice(1), // dont show 1st page as already shown
              ],
            };
          }
        },
      );

      // Edge case if we want to make post before fisrt page loaded
      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
            return !query.state.data
        }
      });

      // SHOW TOAST OF NEW POST
      toast({
        variant: "default",
        description: "Post created",
      });
    },
    // on error not able to post
    onError(error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to post. Try again",
      });
    },
  });

  return mutation;
}
