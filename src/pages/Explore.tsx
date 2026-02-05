import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { getExplorePosts } from '@/store/slice/postsSlice';
import { Heart, MessageCircle, Film } from 'lucide-react'; 
import { Spinner } from '@/components/ui/spinner';
import MediaDisplay from '@/components/img/video/MediaDisplay';
import PostModal from '@/components/comment/PostModal';

export default function Explore() {
  const dispatch = useDispatch<AppDispatch>();
  const { explorePosts, loading } = useSelector((state: RootState) => state.posts);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    dispatch(getExplorePosts());
  }, [dispatch]);

  const handleOpenPost = (post: any) => {
    const normalizedPost = {
      ...post,
      userId: post.user || post.userId
    };
    setSelectedPost(normalizedPost);
  };

  if (loading && explorePosts.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[975px] mx-auto py-4 md:py-8 px-0 md:px-4">
      <div className="grid grid-cols-3 gap-1 md:gap-7">
        {explorePosts.map((post) => (
          <div
            key={post._id}
            className="w-full aspect-square relative group cursor-pointer bg-neutral-100 overflow-hidden"
            onClick={() => handleOpenPost(post)}
          >
            {/* Media Display */}
            <MediaDisplay
              src={post.mediaType === 'video' ? post.video : post.image}
              type={post.mediaType}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />

            {post.mediaType === 'video' && (
              <div className="absolute top-2 right-2 z-10 p-1">
                <Film className="w-5 h-5 text-white drop-shadow-md stroke-[2]" />
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 md:gap-8 z-20">
              
              {/* Likes */}
              <div className="flex items-center text-white font-bold text-sm md:text-lg">
                <Heart className="w-5 h-5 md:w-6 md:h-6 fill-white stroke-white mr-1.5" />
                <span>{post.likes || 0}</span>
              </div>

              {/* Comments */}
              <div className="flex items-center text-white font-bold text-sm md:text-lg">
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 fill-white stroke-white -rotate-90 mr-1.5" />
                <span>{post.comments || 0}</span>
              </div>
            </div>
          </div>
        ))}
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