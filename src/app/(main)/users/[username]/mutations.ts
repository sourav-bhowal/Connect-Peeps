import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserSchemaType } from "@/lib/validations";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";
import { PostsPage } from "@/utils/types";

// UPDATE USER PROFILE MUTATION
export function useUpdateUserProfileMutation() {
  // toast
  const { toast } = useToast();
  // router
  const router = useRouter();
  // query client
  const queryClient = useQueryClient();

  // uploadthing to upload avatar
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  // update user profile mutation
  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatarFile,
    }: {
      values: UpdateUserSchemaType;
      avatarFile?: File;
    }) => {
      // update user info and avatar at same time so we use Promise.all
      return Promise.all([
        updateUserProfile(values),
        avatarFile && startAvatarUpload([avatarFile]), // upload avatar if it exists, send it in array
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      // get url from upload result if it exists i.e. an array so [0] index
      const newAvatarUrl = uploadResult?.[0]?.url;

      // query filter
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

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
              posts: page.posts.map((post) => {
                // check if the post belongs to the updated user
                if (post.user.id === updatedUser.id) {
                  // update the avatar url
                  return {
                    ...post,
                    user: {
                      ...post.user,
                      name: updatedUser.name,
                      bio: updatedUser.bio,
                      avatarUrl: newAvatarUrl || post.user.avatarUrl,
                    },
                  };
                }
                // return the old post
                return post;
              }),
            })),
          };
        },
      );

      // router refresh to update profile for server components
      router.refresh();

      // toast
      toast({
        title: "Profile updated",
        description: "Your profile has been updated.",
      });
    },
    onError: (error) => {
      console.log(error);
      // toast
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return mutation;
}
