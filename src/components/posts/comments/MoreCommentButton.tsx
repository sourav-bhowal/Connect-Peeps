import { CommentData } from "@/utils/types";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import EditCommentDialog from "./editComment/editCommentDialog";
// import DeleteCommentDialog from "./commentDelete/DeleteCommentDialog";

// PROPS FOR MORE COMMENT BUTTON
interface MoreCommentButtonProps {
  comment: CommentData;
  className?: string;
}

// MORE COMMENT BUTTON
export default function MoreCommentButtons({
  comment,
  className,
}: MoreCommentButtonProps) {
  // Show delete dailog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // shoe edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"} className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <span className="flex items-center gap-3 text-primary">
              <Edit className="size-4" />
              Edit
            </span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <DeleteCommentDialog
        comment={comment}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      /> */}
      <EditCommentDialog
        comment={comment}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </>
  );
}
