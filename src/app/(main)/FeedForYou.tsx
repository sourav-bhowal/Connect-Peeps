"use client";
import PostCard from "@/components/posts/postcard/PostCard";
import { PostCardData } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

//FEED USING REACT QUERY
export default function FeedForYou() {
  const query = useQuery<PostCardData[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: async () => {
      const response = await fetch("/api/posts/get-posts");
      if (!response.ok) {
        throw Error(`Request failed with status code ${response.status}`);
      }
      return response.json();
    },
  });

  if (query.status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (query.status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading posts.
      </p>
    );
  }

  return (
    <>
      {query.data.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
