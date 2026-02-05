import { toggleLikePost, toggleSavePost } from '@/store/slice/postsSlice';
import { Bookmark, Heart, MessageCircle, Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';

type props = {
  post: any;
  onCommentClick?: () => void;
}

export default function PostsState({ post, onCommentClick }: props) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isLiked = post.isLiked !== undefined ? post.isLiked : (post.likedBy && currentUser && post.likedBy.includes(currentUser._id));
  const isSaved = post.isSaved !== undefined ? post.isSaved : (post.savedBy && currentUser && post.savedBy.includes(currentUser._id));

  const handleLike = () => {
    if (currentUser?._id) {
      dispatch(toggleLikePost({
        postId: post._id,
        userId: currentUser._id,
        isLiked: isLiked
      }));
    }
  };

  const handleSave = () => {
    if (currentUser?._id) {
      dispatch(toggleSavePost({
        postId: post._id,
        userId: currentUser._id,
        isSaved: isSaved
      }));
    }
  };

  return (
    <div className='flex flex-col'>
      <div className="flex justify-between items-center py-3">
        <div className="flex gap-5">
          <div className='flex items-center gap-1'>
            <button
              onClick={handleLike}
              className="hover:opacity-60 cursor-pointer"
            >
              <Heart
                size={26}
                className={isLiked ? "fill-red-500 text-red-500 transition-colors" : "text-black transition-colors"}
              />
            </button>
            <span className="font-semibold">{post.likes || 0}</span>
          </div>

          <div className='flex items-center gap-1'>
            <button onClick={onCommentClick} className="hover:opacity-60 transition-opacity cursor-pointer">
              <MessageCircle size={26} className="text-black -rotate-90" />
            </button>
            <span>{post.comments?.length || 0}</span>
          </div>

          <button className="hover:opacity-60 transition-opacity cursor-pointer">
            <Send size={26} className="text-black" />
          </button>
        </div>

        <button onClick={handleSave} className="hover:opacity-60 cursor-pointer">
          <Bookmark
            size={26}
            className={isSaved ? "fill-black text-black" : "text-black"}
          />
        </button>
      </div>
    </div>
  )
}