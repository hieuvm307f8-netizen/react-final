import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart, MessageCircle } from "lucide-react";
import type { AppDispatch, RootState } from "@/store/store";
import { getUserPosts, clearProfilePosts } from "@/store/slice/postsSlice";
import MediaDisplay from "../img/video/MediaDisplay";
import PostModal from "../comment/PostModal";
import { Spinner } from "../ui/spinner";

interface ProfilePostGridProps {
  userId: string;
  filter: "all" | "video" | "saved";
}

export default function ProfilePostGrid({ userId, filter }: ProfilePostGridProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { profilePosts, loading } = useSelector((state: RootState) => state.posts);
  const { viewedUser } = useSelector((state: RootState) => state.user);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      dispatch(clearProfilePosts());
      dispatch(getUserPosts({ userId, filter }));
    }
    return () => {
      dispatch(clearProfilePosts());
    };
  }, [dispatch, userId, filter]);

  const handleOpenPost = (post: any) => {
    const fullPostData = {
      ...post,
      userId: post.userId && typeof post.userId === 'object' ? post.userId : viewedUser
    };
    setSelectedPost(fullPostData);
  };

  if (loading && profilePosts.length === 0) {
    return <div className="flex justify-center items-center py-20"><Spinner /></div>;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {profilePosts.map((post) => {
          if (!post) return null;

          return (
            <div
              key={post._id}
              className="relative group aspect-square cursor-pointer bg-gray-100 overflow-hidden"
              onClick={() => handleOpenPost(post)}
            >
              <MediaDisplay
                src={post.mediaType === 'video' ? post.video : post.image}
                type={post.mediaType}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6 text-white font-bold z-10">
                <div className="flex items-center gap-1">
                  <Heart fill="white" size={20} />
                  <span>{post.likes || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle fill="white" size={20} className="-rotate-90" />
                  <span>{post.comments?.length || post.comments || 0}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}