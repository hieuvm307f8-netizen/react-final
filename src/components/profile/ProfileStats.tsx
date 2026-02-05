import React, { useState } from "react";
import FollowState from "../viewFollowState/FollowState";
import type { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { getFollowers, getFollowing } from "@/store/slice/userSlice";

export default function ProfileStats({ user }: { user: any }) {
  const [type, setType] = useState<"followers" | "following" | null>(null);
  const [listData, setListData] = useState([]);
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenList = async (type: "followers" | "following") => {
    const action = type === "followers" ? await dispatch(getFollowers({ userId: user._id })) : await dispatch(getFollowing({ userId: user._id }));

    if (action.payload) {
      setListData(type === "followers" ? action.payload.followers : action.payload.following);
      setType(type);
    }
  };

  return (
    <div className="flex gap-10">
      <div className="flex gap-1 cursor-pointer" onClick={() => handleOpenList("followers")}>
        <span className="font-bold">{user.followersCount ?? 0}</span>
        <span>followers</span>
      </div>
      <div className="flex gap-1 cursor-pointer" onClick={() => handleOpenList("following")}>
        <span className="font-bold">{user.followingCount ?? 0}</span>
        <span>following</span>
      </div>

      {type && (
        <FollowState
          title={type === "followers" ? "Followers" : "Following"}
          users={listData}
          onClose={() => setType(null)}
        />
      )}
    </div>
  );
}