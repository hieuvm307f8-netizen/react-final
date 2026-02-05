import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '@/store/store';
import { getCommentReplies, deleteComment, updateComment, createReply, likeComment, unlikeComment } from '@/store/slice/commentSlice';
import Avatar from '../shared/Avatar';
import { Heart, Trash2, Edit2, Check, X, MessageCircle } from 'lucide-react';
import userService from '@/services/userService';

interface CommentItemProps {
  userIdPicture: any;
  comment: any;
  postId: string;
  parentId?: string;
}

export default function CommentItem({ comment, postId, userIdPicture, parentId }: CommentItemProps) {

  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [picture, setPicture] = useState<string>("");
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(comment.likes > 0);
  const [likesCount, setLikesCount] = useState(comment.likes || 0);
  const replies = useSelector((state: RootState) => state.comments.replies[comment._id]) || [];
  const isLoading = useSelector((state: RootState) => state.comments.replyLoading[comment._id]);
  const hasReplies = (replies && replies.length > 0) || (comment.repliesCount > 0);
  const commentOwnerId = comment.userId?._id || comment.userId;
  const isOwner = currentUser?._id === commentOwnerId;

  useEffect(() => {
    if (userIdPicture) {
      const targetId = typeof userIdPicture === 'object' ? userIdPicture._id : userIdPicture;
      userService.getUserById(targetId).then(res => {
        setPicture(res.data.profilePicture);
      }).catch(() => setPicture(""));
    }
  }, [userIdPicture]);

  useEffect(() => {
    setEditText(comment.content);
    setLikesCount(comment.likes);
  }, [comment]);

  const handleViewReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleUpdate = async () => {
    if (!editText.trim() || editText === comment.content) {
      setIsEditing(false);
      return;
    }
    await dispatch(updateComment({
      postId,
      commentId: comment._id,
      content: editText,
      parentId
    }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Delete this comment?")) {
      dispatch(deleteComment({
        postId,
        commentId: comment._id,
        parentId
      }));
    }
  };

  const handleCreateReply = async () => {
    if (!replyText.trim()) return;

    const resultAction = await dispatch(createReply({
      postId,
      parentId: comment._id,
      content: replyText
    }));

    if (createReply.fulfilled.match(resultAction)) {
      setReplyText("");
      setIsReplying(false);
      setShowReplies(true);
    }
  };

  const handleToggleLike = () => {
    if (!isLiked) {
      dispatch(likeComment({ postId, commentId: comment._id, parentId }));
      setLikesCount((prev: number) => prev + 1);
      setIsLiked(true);
    } else {
      dispatch(unlikeComment({ postId, commentId: comment._id, parentId }));
      setLikesCount((prev: number) => Math.max(0, prev - 1));
      setIsLiked(false);
    }
  };
  if (!comment) return null;

  return (
    <div className="flex gap-3 w-full mb-4">
      <Avatar img={picture} className="w-8 h-8 flex-shrink-0 cursor-pointer hover:opacity-90" />

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex flex-col">
          {isEditing ? (
            <div className="flex flex-col gap-2 w-full">
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
              />
              <div className="flex items-center gap-2 text-xs">
                <button onClick={handleUpdate} className="text-blue-600 font-semibold hover:underline">Save</button>
                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <div className="bg-transparent">
                <span className="font-semibold text-sm mr-2 cursor-pointer hover:underline">
                  {comment.userId?.username || "Unknown"}
                </span>
                <span className="text-sm text-gray-800 break-words">{comment.content}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mt-0.5">
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          <button
            onClick={handleToggleLike}
            className={`${isLiked ? 'text-red-500' : 'hover:text-gray-800'}`}
          >
            {likesCount > 0 ? `${likesCount} likes` : 'Like'}
          </button>
          {!parentId && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="hover:text-gray-800"
            >
              Reply
            </button>
          )}

          {isOwner && !isEditing && (
            <>
              <button onClick={() => setIsEditing(true)} className="hover:text-blue-600">
                <Edit2 size={12} />
              </button>
              <button onClick={handleDelete} className="hover:text-red-600">
                <Trash2 size={12} />
              </button>
            </>
          )}
        </div>

        {isReplying && (
          <div className="mt-3 flex items-start gap-2">
            <div className="flex-1 relative">
              <input
                placeholder={`Reply to ${comment.userId?.username}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:gray-300 pr-10"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateReply()}
              />
              <button
                onClick={handleCreateReply}
                disabled={!replyText.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 font-semibold text-xs disabled:opacity-50 hover:text-blue-700"
              >
                Post
              </button>
            </div>
            <button onClick={() => setIsReplying(false)} className="mt-2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        )}
        {hasReplies && !parentId && (
          <div className="mt-2">
            <button
              onClick={handleViewReplies}
              className="flex items-center gap-2 text-xs text-gray-500 font-semibold group"
            >
              <div className="w-8 h-[1px] bg-gray-300 group-hover:bg-gray-500 transition-colors"></div>
              {showReplies
                ? 'Hide replies'
                : `View replies (${replies.length || comment.repliesCount || 0})`
              }
            </button>
          </div>
        )}

        {showReplies && replies && replies.length > 0 && (
          <div className="mt-3 ml-2 pl-2 flex flex-col gap-4">
            {replies.map((reply: any) => {
              if (!reply) return null;
              const replyUserId = reply.userId?._id || reply.userId;

              return (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  parentId={comment._id}
                  userIdPicture={replyUserId}
                />
              );
            })}
          </div>
        )}
      </div>

      <button onClick={handleToggleLike} className="mt-2 text-gray-400 hover:text-gray-600 self-start">
        <Heart size={14} className={isLiked ? "fill-red-500 text-red-500" : ""} />
      </button>
    </div>
  );
}