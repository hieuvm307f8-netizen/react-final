import { getUserPosts } from "@/store/slice/postsSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { Heart, MessageCircle, Bookmark, Film } from "lucide-react"; // Thêm icon Film
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MediaDisplay from "../img/video/MediaDisplay";
import PostModal from "../comment/PostModal";
import { Spinner } from "../ui/spinner";

export default function Archive() {
  const dispatch = useDispatch<AppDispatch>();
  const { savedPosts, loading } = useSelector((state: RootState) => state.posts);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    // Logic giữ nguyên: Chỉ fetch khi có user và list đang rỗng
    if (currentUser?._id && savedPosts.length === 0) {
      dispatch(getUserPosts({ userId: currentUser._id, filter: 'saved' }));
    }
  }, [dispatch, currentUser?._id]);

  if (loading && savedPosts.length === 0) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // UI cho trạng thái chưa lưu bài nào (Empty State)
  if (!loading && savedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 md:py-20 gap-4 text-center px-4">
        <div className="border-2 border-black rounded-full p-4 md:p-6 mb-2">
            <Bookmark className="w-8 h-8 md:w-12 md:h-12 text-black stroke-[1.5]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-800">Save</h2>
        <p className="text-sm md:text-base text-neutral-600 max-w-sm">
          Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved.
        </p>
      </div>
    );
  }

  return (
    // Container giới hạn độ rộng chuẩn
    <div className="w-full max-w-[975px] mx-auto py-8 px-0 md:px-4">
      
      {/* Grid Layout: Gap 1 mobile, Gap 7 desktop */}
      <div className="grid grid-cols-3 gap-1 md:gap-7">
        {savedPosts.map((post) => {
          if (!post) return null;
          return (
            <div
              key={post._id}
              className="w-full aspect-square cursor-pointer relative group bg-neutral-100 overflow-hidden"
              onClick={() => setSelectedPost(post)}
            >
              <MediaDisplay
                src={post.mediaType === 'video' ? post.video : post.image}
                type={post.mediaType}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Video Indicator (Góc phải trên) */}
              {post.mediaType === 'video' && (
                <div className="absolute top-2 right-2 z-10 p-1">
                    <Film className="w-5 h-5 text-white drop-shadow-md stroke-[2]" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 md:gap-8 z-20">
                <div className="flex items-center text-white font-bold text-sm md:text-lg">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 fill-white stroke-white mr-1.5" />
                  {post.likes || 0}
                </div>
                <div className="flex items-center text-white font-bold text-sm md:text-lg">
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6 fill-white stroke-white -rotate-90 mr-1.5" />
                  {post.comments?.length || 0}
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
    </div>
  );
}