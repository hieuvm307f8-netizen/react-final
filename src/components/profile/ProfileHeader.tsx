import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { type AppDispatch, type RootState } from "@/store/store";
import { getUserById, clearViewedUser } from "@/store/slice/userSlice";
import Avatar from "../shared/Avatar";
import { Button } from "../ui/button";
import { Ellipsis, Settings } from "lucide-react";
import ProfileStats from "./ProfileStats";
import EditProfileModal from "../update/EditProfileModal";
import FollowButton from "../followButton/FollowButton";
import { Spinner } from "../ui/spinner";
import { createOrGetConversation } from "@/store/slice/chatSlice";

export default function ProfileHeader() {
  const { userId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const viewedUser = useSelector((state: RootState) => state.user.viewedUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
    return () => {
      dispatch(clearViewedUser());
    }
  }, [userId, dispatch]);


  const isOwnProfile = currentUser && userId === currentUser._id;
  let displayUser = viewedUser;
  if (isOwnProfile && currentUser) {
    displayUser = viewedUser ? { ...viewedUser, ...currentUser } : currentUser;
  }

  if (!displayUser) return <Spinner>Loading...</Spinner>
  const handleMessageBtn = async () => {
    if (!displayUser) return;
    try {
      const resultAction = await dispatch(createOrGetConversation(displayUser._id));
      if (createOrGetConversation.fulfilled.match(resultAction)) {
        navigate(`/messages/${resultAction.payload._id}`);
      }
    } catch (error) {
      console.error("Failed to chat", error);
    }
  };


  return (
    <div className="flex flex-row w-full mb-10">
      <div className="w-[30%] flex justify-center mr-8 pt-2">
        <Avatar img={displayUser.profilePicture} className="w-36 h-36 border rounded-full object-cover" />
      </div>
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        <div className="flex items-center gap-5 flex-wrap">
          <span className="text-xl font-normal">{displayUser.username}</span>
          <div className="flex gap-3 items-center">
            {isOwnProfile ? (
              <>
                <Button onClick={() => setIsEditModalOpen(true)} variant="secondary" className="h-8 px-4 font-semibold text-sm bg-gray-100 hover:bg-gray-200 text-black cursor-pointer">Edit Profile</Button>
                <Button variant="secondary" className="h-8 px-4 font-semibold text-sm bg-gray-100 hover:bg-gray-200 text-black">View archive</Button>
                <Settings className="cursor-pointer w-6 h-6" />
              </>
            ) : (
              <>
                <FollowButton
                  userId={displayUser._id}
                  isFollowing={displayUser.isFollowing}
                  type="button"
                />
                <Button onClick={handleMessageBtn} variant="secondary" className="h-8 px-4 font-semibold text-sm bg-gray-100 hover:bg-gray-200 text-black">Message</Button>
                <Ellipsis className="cursor-pointer w-6 h-6" />
              </>
            )}
          </div>
        </div>
        <div className="flex">
          <ProfileStats user={displayUser} />
        </div>
        <div className="flex flex-col gap-1 text-sm max-w-full">
          <span className="font-semibold text-[15px]">{displayUser.fullName}</span>
          <span>{displayUser.bio}</span>
        </div>
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
}