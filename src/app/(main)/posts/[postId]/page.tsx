import { prisma } from "@/lib/prismaDB";
import { getPostData, PostCardData, UserData } from "@/utils/types";
import { cache, Suspense } from "react";
import notFound from "../../not-found";
import { validateRequest } from "@/utils/auth";
import PostCard from "@/components/posts/postcard/PostCard";
import UserToolTip from "@/components/shared/UserToolTip";
import Link from "next/link";
import UserAvatar from "@/components/shared/UserAvatar";
import { Loader2 } from "lucide-react";
import LinkifyLinks from "@/components/links/LinkifyLinks";
import FollowButton from "@/components/shared/FollowButton";

// Post Details page params
interface PostDetailsPageProps {
  params: {
    postId: string;
  };
}

// Fetch Post Data and cache
const fetchPost = cache(async (postId: string, loggedInUserId: string) => {
  // find post in DB
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostData(loggedInUserId),
  });

  // if post not found
  if (!post) notFound();

  // return post
  return post;
});

// function to generate MetaData
export async function generateMetadata({
  params: { postId },
}: PostDetailsPageProps) {
  // get user from session
  const { user } = await validateRequest();
  // if user not logged in
  if (!user) return {};

  // Get the post
  const post = await fetchPost(postId, user.id);

  // If post found return MetaData
  return {
    title: `${post?.user.username}: ${post?.content.slice(0, 50)}...`,
  };
}

// Inteface for Post details sidebar
interface PostDetailsSidebarProps {
  user: UserData;
}

// Post Details Sidebar
async function PostDetailsSidebar({ user }: PostDetailsSidebarProps) {
  // Get the user
  const { user: loggedInUser } = await validateRequest();
  // artificial delay
  //   await new Promise((resolve) => setTimeout(resolve, 5000));
  // if user not logged in
  if (!loggedInUser) return null;

  // return Post Details Sidebar
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About {user.username}</div>
      <UserToolTip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.name}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserToolTip>
      <LinkifyLinks>
        <p className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </p>
      </LinkifyLinks>
      {/* Follow Button*/}
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: !!user.followers.some(
              (follower) => follower.followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  );
}

// Post Details page
export default async function PostDetailsPage({
  params: { postId },
}: PostDetailsPageProps) {
  // get user from session
  const { user } = await validateRequest();
  // if user not logged in
  if (!user) {
    return (
      <p className="text-destructive">
        You need to be logged in to view this page.
      </p>
    );
  }
  // Get the post
  const post = await fetchPost(postId, user.id);

  // Render the post
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        {/* Post Card */}
        <PostCard post={post as PostCardData} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        {/* Suspence helps to load the component itself without blocking the ui */}
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <PostDetailsSidebar user={post?.user as UserData} />
        </Suspense>
      </div>
    </main>
  );
}
