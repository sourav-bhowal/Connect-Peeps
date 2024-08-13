"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { createPost } from "./action";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import "./styles.css";
import { usePostSubmitMutation } from "./mutations";
import { Loader2 } from "lucide-react";
import useMediaUpload from "./useMediaUpload";
import MediaUploadButton from "./MediaUploadButton";
import { MediaPreviews } from "./MediaPreview";

// CREATE POST EDITOR
export default function PostEditor() {
  // TAKE USER FORM SESSION CONTEXT
  const { user } = useSession();

  // USE MUTATION
  const mutation = usePostSubmitMutation();

  // MEDIA UPLOAD HOOK
  const {
    medias,
    uploadProgress,
    startUpload,
    removeMedia,
    isUploading,
    resetMediaUploads,
  } = useMediaUpload();

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
  function onSubmit() {
    // SEND DATA TO SERVER
    mutation.mutate(
      {
        content: inputValues,
        mediaIds: medias
          .map((media) => media.mediaId)
          .filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          // CLEAR CONTENT
          editor?.commands.clearContent();
          // RESET MEDIA UPLOAD
          resetMediaUploads();
        },
      },
    );
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
      {/* MEDIA PREVIEWS */}
      {!!medias.length && (
        <MediaPreviews medias={medias} removeMedia={removeMedia} />
      )}
      <div className="flex items-center justify-end gap-3">
        {/* UPLOAD PROGRESS */}
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        {/* MEDIA UPLOAD BUTTON */}
        <MediaUploadButton
          onFilesSelected={startUpload}
          disabled={isUploading || medias.length >= 5}
        />

        {/* SUBMIT BUTTON */}
        <Button
          onClick={onSubmit}
          disabled={!inputValues.trim() || isUploading}
          className="min-w-20"
        >
          {mutation.isPending ? <Loader2 className="animate-spin" /> : "Post"}
        </Button>
      </div>
    </div>
  );
}
