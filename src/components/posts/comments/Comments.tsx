import { CommentData, CommentsPage, PostCardData } from "@/utils/types";
import CommentInput from "./commentEditor/CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import { kyInstance } from "@/utils/ky";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/shared/UserAvatar";
import UserToolTip from "@/components/shared/UserToolTip";
import { formatRelativeDate } from "@/utils/time";
import MoreCommentButtons from "./MoreCommentButton";
import Link from "next/link";

// COMMENTS PROPS
interface CommentsProps {
  post: PostCardData;
}

// WHOLE COMMENTS COMPONENT
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
    <div className="space-y-3">
      <CommentInput post={post} />
      {/* Button to load more comments */}
      {hasNextPage && (
        <Button
          variant={"link"}
          onClick={() => fetchNextPage()}
          className="mx-auto block"
          disabled={isFetching}
        >
          {isFetching ? <Loader2 className="animate-spin" /> : "Load more"}
        </Button>
      )}
      {/* Comments Status*/}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occured while loading comments.
        </p>
      )}
      {/* Comments */}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

// COMMENT PROPS
interface CommentProps {
  comment: CommentData;
}

// COMMENT COMPONENT
export function Comment({ comment }: CommentProps) {
  // User from session
  const { user: loggedInUser } = useSession();
  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserToolTip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
          </Link>
        </UserToolTip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <Link
            href={`/users/${comment.user.username}`}
            className="font-medium capitalize hover:underline"
          >
            {comment.user.name}
          </Link>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <p>{comment.content}</p>
      </div>
      {comment.user.id === loggedInUser.id && (
        <MoreCommentButtons
          comment={comment}
          className="ms-auto sm:opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
