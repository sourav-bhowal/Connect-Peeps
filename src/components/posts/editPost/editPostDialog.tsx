import { updatePostSchema, UpdatePostSchemaType } from "@/lib/validations";
import { PostCardData } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEditPostMutation } from "./mutations";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Interface for Edit Post Dialog
interface EditPostDialogProps {
  post: PostCardData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// EDIT POST DIALOGUE
export default function EditPostDialog({
  post,
  open,
  onOpenChange,
}: EditPostDialogProps) {
  // Form
  const form = useForm<UpdatePostSchemaType>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      content: post.content,
    },
  });

  // Submit Form Mutation
  const mutation = useEditPostMutation();

  // Handle Submit
  async function onSubmit(values: UpdatePostSchemaType) {
    // mutate
    mutation.mutate(
      { content: values.content, postId: post.id },
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
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
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
