"use client";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/shared/UserAvatar";
import { formatRelativeDate } from "@/utils/time";
import { PostCardData } from "@/utils/types";
import Link from "next/link";
import MorePostButtons from "../MorePostButton";
import LinkifyLinks from "@/components/links/LinkifyLinks";
import UserToolTip from "@/components/shared/UserToolTip";

// TYPE OF POSTCARD
interface PostCardProps {
  post: PostCardData;
}

// POST CARD COMPONENT
export default function PostCard({ post }: PostCardProps) {
  // user from session
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserToolTip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserToolTip>
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
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {/* Show more button if post owner */}
        {post.user.id === user.id && (
          <MorePostButtons
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <LinkifyLinks>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </LinkifyLinks>
    </article>
  );
}
