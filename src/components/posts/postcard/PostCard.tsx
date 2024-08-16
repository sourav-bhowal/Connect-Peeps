"use client";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/shared/UserAvatar";
import { formatRelativeDate } from "@/utils/time";
import { PostCardData } from "@/utils/types";
import Link from "next/link";
import MorePostButtons from "../MorePostButton";
import LinkifyLinks from "@/components/links/LinkifyLinks";
import UserToolTip from "@/components/shared/UserToolTip";
import { Media } from "@prisma/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import LikeButton from "@/components/shared/LikeButton";
import BookmarkButton from "@/components/shared/BookmarkButton";

// TYPE OF POSTCARD
interface PostCardProps {
  post: PostCardData;
}

// POST CARD COMPONENT
export default function PostCard({ post }: PostCardProps) {
  // user from session
  const { user: loggedInUser } = useSession();

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
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {/* Show more button if post owner */}
        {post.user.id === loggedInUser.id && (
          <MorePostButtons
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <LinkifyLinks>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </LinkifyLinks>
      {/* RENDER MEDIA PREVIEWS IF EXISTS */}
      {!!post.media.length && <PostCardMediaPreviews medias={post.media} />}
      <hr className="text-muted-foreground" />
      {/* RENDER LIKES and BOOKMARK BUTTON */}
      <div className="flex justify-between gap-5">
        <LikeButton
          postId={post.id}
          initialState={{
            likes: post._count.likes,
            isLikedByUser: post.likes.some(
              (like) => like.userId === loggedInUser.id,
            ),
          }}
        />
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === loggedInUser.id,
            ),
          }}
        />
      </div>
    </article>
  );
}

// POST CARD MEDIA PREVIEWS COMPONENT PROPS
interface PostCardMediaPreviewsProps {
  medias: Media[];
}

// POST CARD MEDIA PREVIEWS COMPONENT
function PostCardMediaPreviews({ medias }: PostCardMediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        medias.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {/* MEDIA PREVIEW FOR EACH MEDIA IN POST */}
      {medias.map((media) => (
        <PostCardMediaPreview key={media.id} media={media} />
      ))}
    </div>
  );
}

// POST CARD MEDIA PREVIEW COMPONENT PROPS
interface PostCardMediaPreviewProps {
  media: Media;
}

// POST CARD MEDIA PREVIEW COMPONENT
function PostCardMediaPreview({ media }: PostCardMediaPreviewProps) {
  // if media is image
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt={"media"}
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  // if media is video
  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }

  // if media is not supported
  return <p className="text-destructive">Unsupported Media</p>;
}
