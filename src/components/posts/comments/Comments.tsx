import { CommentData, CommentsPage, PostCardData } from "@/utils/types";
import CommentInput from "./commentEditor/CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import { kyInstance } from "@/utils/ky";

// COMMENTS PROPS
interface CommentsProps {
  post: PostCardData;
}

// COMMENTS COMPONENT
export default function Comments({ post }: CommentsProps) {
  // Infinite query to fetch comments
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["post-comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/comments/${post.id}`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      // reverse the comments order
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  // Comments
  const comments = data?.pages.flatMap((page) => page.comments) || [];

  // Return
  return (
    <div>
      <CommentInput post={post} />
    </div>
  );
}

// COMMENT PROPS
interface CommentProps {
  comment: CommentData;
}

// COMMENT COMPONENT
export function Comment({ comment }: CommentProps) {
  return <div>{comment.content}</div>;
}
