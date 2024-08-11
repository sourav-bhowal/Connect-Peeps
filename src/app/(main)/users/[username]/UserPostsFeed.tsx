"use client";
import PostCard from "@/components/posts/postcard/PostCard";
import PostsLodingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import InfiniteScrollContainer from "@/components/shared/InfiniteScrollContainer";
import { kyInstance } from "@/utils/ky";
import { PostsPage } from "@/utils/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface UserPostsFeedProps {
    userId: string;
}

//FEED USING REACT QUERY
export default function UserPostsFeed({ userId }: UserPostsFeedProps) {
  // GET POSTS USING REACT QUERY INFINTE SCROLL
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "user-posts", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/posts/user/${userId}/post`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  // RENDERING POSTS
  if (status === "pending") {
    return <PostsLodingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return <p className="text-center text-muted-foreground">
      No posts found for this user.
    </p>
  }

  // IF THERE IS AN ERROR
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading posts.
      </p>
    );
  }

  // RENDER POSTS
  return (
    <InfiniteScrollContainer className="space-y-5"
    onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {
        isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />
      }
    </InfiniteScrollContainer>
  );
}
