import LinkifyLinks from "@/components/links/LinkifyLinks";
import FollowButton from "@/components/shared/FollowButton";
import UserAvatar from "@/components/shared/UserAvatar";
import UserToolTip from "@/components/shared/UserToolTip";
import { validateRequest } from "@/utils/auth";
import { UserData } from "@/utils/types";
import Link from "next/link";

// Inteface for Post details sidebar
interface PostDetailsSidebarProps {
    user: UserData;
  }
  
  // Post Details Sidebar
 export async function PostDetailsSidebar({ user }: PostDetailsSidebarProps) {
    // Get the user
    const { user: loggedInUser } = await validateRequest();
    
    // if user not logged in
    if (!loggedInUser) return null;
  
    // return Post Details Sidebar
    return (
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="text-xl font-bold">About {user.username}</div>
        <UserToolTip user={user}>
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.name}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
        </UserToolTip>
        <LinkifyLinks>
          <p className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
            {user.bio}
          </p>
        </LinkifyLinks>
        {/* Follow Button*/}
        {user.id !== loggedInUser.id && (
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: !!user.followers.some(
                (follower) => follower.followerId === loggedInUser.id,
              ),
            }}
          />
        )}
      </div>
    );
  }