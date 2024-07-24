"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { createPost } from "./action";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import "./styles.css"

// CREATE POST EDITOR
export default function PostEditor() {
  // TAKE USER FORM SESSION CONTEXT
  const { user } = useSession();

  // CONFIG THE EDITOR
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write something...",
      }),
    ],
  });

  // CONFIG THE INPUT VALUES FROM EDITOR
  const inputValues =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  // ON SUBMIT EDITOR OR FORM
  async function onSubmit() {
    // SEND DATA TO SERVER
    await createPost(inputValues);
    // CLEAR THE INPUT VALUES
    editor?.commands.clearContent();
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!inputValues.trim()}
          className="min-w-20"
        >
          Post
        </Button>
      </div>
    </div>
  );
}
