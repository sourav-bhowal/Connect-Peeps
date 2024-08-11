import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSideBar from "@/components/shared/TrendsSideBar";
import FeedForYou from "./FeedForYou";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        {/* SHOW ADD POST WIDGET */}
        <PostEditor />
        {/* SHOW POSTS WIDGET IN TABS FORMAT */}
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          {/* ALL POSTS */}
          <TabsContent value="for-you">
            <FeedForYou />
          </TabsContent>
          {/* FOLLOWING POSTS */}
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      {/* SHOW RIGHT SIDE BAR */}
      <TrendsSideBar />
    </main>
  );
}
