import { PostCardData } from "@/utils/types";
import { useDeletePostMutation } from "./mutations";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

// TYPE
interface DeletePostDialogueProps {
  post: PostCardData;
  open: boolean;
  onClose: () => void;
}

// DELETE POST DIALOGUE
export default function DeletePostDialogue({
  post,
  open,
  onClose,
}: DeletePostDialogueProps) {
    // delete mutation
  const mutation = useDeletePostMutation();

  // handle open
  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={() =>
              mutation.mutate(post.id, {
                onSuccess: onClose,
              })
            }
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
          <Button
            variant={"outline"}
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
