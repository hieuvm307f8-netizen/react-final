import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, MoreHorizontal } from 'lucide-react';
import { type AppDispatch, type RootState } from '@/store/store';
import { resetComments, getPostComments, createComment } from '@/store/slice/commentSlice';
import CommentItem from './CommentItem';
import Avatar from '../shared/Avatar';
import PostsState from '../posts/PostsState';
import userService from '@/services/userService';
import MediaDisplay from '../img/video/MediaDisplay';
import { Spinner } from '../ui/spinner';

interface Props {
  post: any;
  onClose: () => void;
}

export default function PostModal({ post, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading } = useSelector((state: RootState) => state.comments);
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorPicture, setAuthorPicture] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    dispatch(resetComments());
    dispatch(getPostComments({ postId: post._id }));

    if (post.userId._id) {
      userService.getUserById(post.userId._id)
        .then(res => {
          setAuthorPicture(res.data.profilePicture);
        })
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [post.userId_id, post.userId, dispatch]);

  const handlePostComment = async () => {
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await dispatch(createComment({
        postId: post._id,
        content: commentText
      })).unwrap();

      setCommentText("")
    } catch (err) {
      alert("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-8">
      <button onClick={onClose} className="absolute top-4 right-4 text-white">
        <X size={30} />
      </button>

      <div className="bg-white max-w-[1100px] w-full h-[90vh] flex rounded-r-md overflow-hidden">
        <div className="bg-black flex-[1.5] flex items-center justify-center border-r border-gray-100">
          {/* {post.mediaType === 'video' ? (
            <video src={post.videoUrl} controls className="w-full h-full object-contain" />
          ) : (
            <img src={post.imageUrl} className="w-full h-full object-contain" />
          )} */}
          <MediaDisplay
            src={post.mediaType === 'video' ? post.video : post.image}
            type={post.mediaType}
            className="w-full object-contain"
          />
        </div>
        <div className="w-[400px] flex flex-col shrink-0 bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar img={authorPicture} className="w-8 h-8" />
              <span className="font-semibold text-sm">{post.userId.username}</span>
            </div>
            <MoreHorizontal size={20} />
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <div className="flex gap-3 mb-6">
              <Avatar img={authorPicture} className="w-8 h-8 shrink-0" />
              <div className="text-sm">
                <span className="font-semibold mr-2">{post.userId.username}</span>
                <span>{post.caption}</span>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {loading && comments.length === 0 && (
              <div className="flex justify-center py-10">
                <Spinner></Spinner>
              </div>
            )}

            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={post._id}
                userIdPicture={comment.userId._id || comment.userId}
              />
            ))}
          </div>

          <div className="border-t border-gray-200 p-4">
            <PostsState post={post} onCommentClick={() => inputRef.current?.focus()} />

            <div className="flex items-center pt-4 border-t border-gray-100 gap-3">
              <Avatar img={currentUser?.profilePicture} className="w-8 h-8 shrink-0" />

              <input
                ref={inputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                placeholder="Add a comment..."
                className="flex-1 outline-none text-sm"
              />

              <button
                onClick={handlePostComment}
                disabled={!commentText.trim() || isSubmitting}
                className={`font-semibold text-sm ${!commentText.trim() || isSubmitting ? 'text-blue-200' : 'text-blue-500'
                  }`}
              >
                {isSubmitting ? '...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}