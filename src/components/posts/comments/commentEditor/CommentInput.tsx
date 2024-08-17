import { PostCardData } from "@/utils/types";
import { useState } from "react";
import { useCreateCommentMutation } from "./mutations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, SendHorizonal } from "lucide-react";

// Comment Input Props
interface CommentInputProps {
  post: PostCardData;
}

// Comment Input Component
export default function CommentInput({ post }: CommentInputProps) {
  // State for comment text
  const [commentText, setCommentText] = useState("");

  // Mutation for creating comment
  const mutation = useCreateCommentMutation(post.id);

  // Handle On Submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent default form submission
    e.preventDefault();
    // If no comment text, return
    if (!commentText) return;
    // Call create comment mutation
    mutation.mutate(
      {
        content: commentText,
        post,
      },
      {
        onSuccess: () => {
          // Clear comment text
          setCommentText("");
        },
      },
    );
  }

  return (
    <form className="flex w-full items-center gap-2" onSubmit={handleSubmit}>
      <Input
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant={"ghost"}
        size={"icon"}
        disabled={mutation.isPending || !commentText.trim()}
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <SendHorizonal className="size-5" />
        )}
      </Button>
    </form>
  );
}
