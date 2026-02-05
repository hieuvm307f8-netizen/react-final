import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { type AppDispatch, type RootState } from "@/store/store";
import { getSuggestedUsers } from "@/store/slice/userSlice";
import Avatar from "@/components/shared/Avatar";
import FollowButton from "@/components/followButton/FollowButton";
import { Spinner } from "@/components/ui/spinner";

export default function Suggestion() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { suggestedUsers, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getSuggestedUsers());
  }, [dispatch]);

  if (!currentUser) return null;

  return (
    <div className="py-8 pl-4 pr-4 max-w-[380px] hidden lg:block">
      <div className="flex justify-between items-center mb-6">
        <NavLink to={`/profile/${currentUser._id}`} className="flex items-center gap-4 cursor-pointer">
          <Avatar img={currentUser.profilePicture} className="w-12 h-12 border border-gray-200" />
          <div className="flex flex-col">
            <span className="font-semibold text-sm hover:opacity-70 transition-opacity">
              {currentUser.username}
            </span>
            <span className="text-gray-500 text-sm max-w-[150px]">
              {currentUser.fullName}
            </span>
          </div>
        </NavLink>
        <button className="text-[#0095f6] text-xs font-bold">
          Switch
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500 font-bold text-sm">Suggested for you</span>
        <span className="text-xs font-bold cursor-pointer hover:text-gray-400">See all</span>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <Spinner className="text-xs text-gray-400">Loading...</Spinner>
        ) : (
          suggestedUsers.map((user: any) => (
            <div key={user._id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <NavLink to={`/profile/${user._id}`}>
                  <Avatar img={user.profilePicture} className="w-8 h-8 border border-gray-200" />
                </NavLink>

                <div className="flex flex-col">
                  <NavLink to={`/profile/${user._id}`}>
                    <span className="font-semibold text-sm hover:opacity-70 transition-opacity cursor-pointer">
                      {user.username}
                    </span>
                  </NavLink>
                  <span className="text-gray-500 text-xs max-w-[180px]">
                    {user.followersCount > 0 ? `${user.followersCount} followers` : user.fullName || "Suggested for you"}
                  </span>
                </div>
              </div>

              <FollowButton
                userId={user._id} isFollowing={user.isFollowing} />
            </div>
          ))
        )}

        {!loading && suggestedUsers.length === 0 && (
          <div className="text-xs text-gray-400">No suggestions available</div>
        )}
      </div>

      <div className="mt-8">
        <div className="text-xs text-gray-500 flex flex-wrap gap-x-2 gap-y-1">
          <span className="cursor-pointer hover:underline">About</span>
          <span className="cursor-pointer hover:underline">Help</span>
          <span className="cursor-pointer hover:underline">Press</span>
          <span className="cursor-pointer hover:underline">API</span>
          <span className="cursor-pointer hover:underline">Jobs</span>
          <span className="cursor-pointer hover:underline">Privacy</span>
          <span className="cursor-pointer hover:underline">Terms</span>
          <span className="cursor-pointer hover:underline">Locations</span>
          <span className="cursor-pointer hover:underline">Language</span>
          <span className="cursor-pointer hover:underline">Meta Verified</span>
        </div>
        <div className="text-xs text-gray-500 mt-4 uppercase">
          © 2026 INSTAGRAM FROM META
        </div>
      </div>
    </div>
  );
}