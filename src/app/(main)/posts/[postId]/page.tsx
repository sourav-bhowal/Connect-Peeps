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
import { PostDetailsSidebar } from "./PostDetailsSideBar";

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

// Post Details page
export default async function Page({
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


