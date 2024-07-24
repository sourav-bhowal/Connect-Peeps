import PostEditor from "@/components/posts/editor/PostEditor";
import PostCard from "@/components/posts/postcard/PostCard";
import TrendsSideBar from "@/components/shared/TrendsSideBar";
import { prisma } from "@/lib/prismaDB";
import { PostCardDataType } from "@/utils/types";

export default async function Home() {
  // FETCH POSTS
  const posts = await prisma.post.findMany({
    include: PostCardDataType,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <TrendsSideBar />
    </main>
  );
}
