import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSideBar from "@/components/shared/TrendsSideBar";
import FeedForYou from "./FeedForYou";

export default function Home() {
  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
         {/* SHOW ADD POST WIDGET */}
        <PostEditor />
        {/* SHOW POSTS */}
        <FeedForYou />
      </div>
      {/* SHOW RIGHT SIDE BAR */}
      <TrendsSideBar />
    </main>
  );
}
