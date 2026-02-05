import { useDispatch } from "react-redux";
import { followUser, unfollowUser } from "@/store/slice/userSlice";
import { Button } from "../ui/button";
import type { AppDispatch } from "@/store/store";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  type?: "text" | "button";
}

export default function FollowButton({ userId, isFollowing, type = "text" }: FollowButtonProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn chặn click lan ra parent (ví dụ click vào card user)
    if (isFollowing) {
      dispatch(unfollowUser(userId));
    } else {
      dispatch(followUser(userId));
    }
  };

  // UI cho dạng Text Link (thường dùng ở Sidebar / Suggested lists)
  if (type === "text") {
    return (
      <button
        onClick={handleAction}
        className={`text-xs font-bold transition-colors duration-200 
          ${isFollowing 
            ? "text-neutral-500 hover:text-neutral-700" // Đã follow: Xám đậm
            : "text-[#0095f6] hover:text-[#00376b]"      // Chưa follow: Xanh IG
          }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    );
  }

  // UI cho dạng Button (thường dùng ở Profile / Popups)
  return (
    <Button
      onClick={handleAction}
      className={`h-8 px-5 font-semibold text-sm rounded-lg transition-all duration-200 shadow-none border-none
        ${isFollowing
          ? "bg-[#efefef] hover:bg-[#dbdbdb] text-black" // Đã follow: Nền xám, chữ đen
          : "bg-[#0095f6] hover:bg-[#1877f2] text-white" // Chưa follow: Nền xanh, chữ trắng
        }
      `}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}