import { PostCardData } from "@/utils/types";
import { useDeletePostMutation } from "./mutations";
import { Dialog } from "../ui/dialog";

// TYPE
interface DeletePostDialogueProps {
    post: PostCardData;
    open: boolean;
    onClose: () => void;
}


// DELETE POST DIALOGUE
export default function DeletePostDialogue({post, open, onClose}: DeletePostDialogueProps) {

    const mutation = useDeletePostMutation();
    return (
        <Dialog open={open} onOpenchange={}>
            
        </Dialog>
    )
}