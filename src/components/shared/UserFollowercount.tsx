"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { formatNumber } from "@/utils/topicsCount";
import { FollowerInfo } from "@/utils/types";

// FOLLOW INFO TYPE
interface UserFollowercountProps {
  userId: string;
  initialState: FollowerInfo;
}

// USER FOLLOWER COUNT
export default function UserFollowerCount({
  userId,
  initialState,
}: UserFollowercountProps) {
  // FOLLOW DATA
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <span>
      Followers:{" "}
      <span className="font-bold">{formatNumber(data.followers)}</span>
    </span>
  );
}
