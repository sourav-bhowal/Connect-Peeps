import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";
import { useSession } from "../SessionProvider";
import { Button } from "@/components/ui/button";
import { MailPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

// ChatSideBar Props
interface ChatSideBarProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatSideBar({ onClose, open }: ChatSideBarProps) {
  // get user from session
  const { user: loggedInUser } = useSession();

  // Channel Preview
  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose],
  );

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [loggedInUser?.id] },
        }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {
                members: { $in: [loggedInUser?.id] },
              },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
}

// interface menu header
interface MenuHeaderProps {
  onClose: () => void;
}

// menu header
function MenuHeader({ onClose }: MenuHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-2">
      <div className="h-full md:hidden">
        <Button size={"icon"} variant="ghost" onClick={onClose}>
          <X className="size-5" />
        </Button>
      </div>
      <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
      {/* Start new chat */}
      <Button size={"icon"} variant="ghost" title="Start new chat">
        <MailPlus className="size-5" />
      </Button>
    </div>
  );
}
