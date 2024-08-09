import UserAvatar from "@/components/shared/UserAvatar";
import { formatRelativeDate } from "@/utils/time";
import { PostCardData } from "@/utils/types";
import Link from "next/link";

// TYPE OF POSTCARD
interface PostCardProps {
  post: PostCardData;
}

// POST CARD COMPONENT
export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Link href={`/users/${post.user.username}`}>
          <UserAvatar avatarUrl={post.user.avatarUrl} />
        </Link>
        <div>
          <Link
            href={`/users/${post.user.username}`}
            className="block font-medium hover:underline"
          >
            {post.user.name}
          </Link>
          <Link
            href={`/posts/${post.id}`}
            className="block text-sm text-muted-foreground hover:underline"
          >
            {/* {formatRelativeDate(post.createdAt)} */}
          </Link>
        </div>
      </div>
      <div className="whitespace-pre-line break-words">
        {post.content}
      </div>
    </article>
  );
}
