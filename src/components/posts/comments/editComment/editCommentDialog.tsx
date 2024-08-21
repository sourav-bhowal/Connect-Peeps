import {
  createCommentSchema,
  CreateCommentSchemaType,
} from "@/lib/validations";
import { CommentData } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEditCommentMutation } from "./mutations";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Interface for Edit Post Dialog
interface EditCommentDialogProps {
  comment: CommentData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// EDIT COMMENT DIALOGUE
export default function EditCommentDialog({
  comment,
  open,
  onOpenChange,
}: EditCommentDialogProps) {
  // Form
  const form = useForm<CreateCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: comment.content,
    },
  });

  // Submit Form Mutation
  const mutation = useEditCommentMutation();

  // Handle Submit
  async function onSubmit(values: CreateCommentSchemaType) {
    // mutate
    mutation.mutate(
      { content: values.content, commentId: comment.id },
      // On success close dialog
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  }

  // Return
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-2"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What's on your mind?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
