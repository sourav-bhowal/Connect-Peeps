import { PostsPage } from "@/utils/types";
import { useToast } from "../ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./actions";

// DELETE POST MUTATION
export function useDeletePostMutation() {
  // TOAST
  const { toast } = useToast();
  // QUERY CLIENT
  const queryClient = useQueryClient();
  // ROUTER
  const router = useRouter();
  // PATHNAME
  const pathName = usePathname();

  // Mutation
  const mutation = useMutation({
    // delete post
    mutationFn: deletePost,
    // On success do this
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
            })),
          };
        },
      );

      toast({
        description: "Post deleted.",
      });

      if (pathName === `/posts/${deletedPost.id}`) {
        router.push("/");
      }
    },
    // on error do this
    onError(error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to delete post. Try again",
      });
    },
  });

  // return mutation
  return mutation;
}
