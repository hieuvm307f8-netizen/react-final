import { MoreHorizontal } from "lucide-react";
import PostModal from "../comment/PostModal";
import MediaDisplay from "../img/video/MediaDisplay";
import { Spinner } from "../ui/spinner";
import PostsState from "./PostsState";
import Avatar from "../shared/Avatar";
import { deletePost, getPostDetails, updatePost } from "@/store/slice/postsSlice";
import userService from "@/services/userService";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { NavLink } from "react-router-dom";

export default function PostItem({ data }: { data: any }) {
    const [author, setAuthor] = useState<any>(null);
    const [statePost, setStatePost] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editCaption, setEditCaption] = useState(data.caption);
    const [showMenu, setShowMenu] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (data.userId?._id) {
            userService.getUserById(data.userId._id).then(res => {
                setAuthor(res.data);
            });
        }
        dispatch(getPostDetails(data._id)).then((action) => {
            if (getPostDetails.fulfilled.match(action)) {
                setStatePost(action.payload)
            }
        });
    }, [data._id, data.userId?._id]);

    const handleDelete = async () => {
        if (window.confirm("delete this post?")) {
            await dispatch(deletePost(data._id));
        }
    };

    const handleUpdate = async () => {
        if (editCaption !== data.caption) {
            await dispatch(updatePost({ postId: data._id, caption: editCaption }));
        }
        setIsEditing(false);
        setShowMenu(false);
    };

    const handleOpenModal = () => setIsModalOpen(true);

    const cancelEdit = () => {
        setEditCaption(data.caption);
        setIsEditing(false);
        setShowMenu(false);
    }

    return (
        <>
            <div className="max-w-[470px] w-full mx-auto mb-8 border-b border-gray-200 pb-4 relative">
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                        <NavLink to={`/profile/${author?._id}`} className="flex items-center gap-2">
                            <Avatar img={author?.profilePicture} className="w-12 h-12" />
                            <span className="font-semibold text-sl">{data.userId?.username || "null name"}</span>
                        </NavLink>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 cursor-pointer"
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-10 bg-white shadow-lg border rounded-md z-10 w-50 h-auto py-1 flex flex-col">
                                <button
                                    onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm w-full justify-center cursor-pointer"
                                >
                                    Sửa
                                </button>
                                <div className="border-b"></div>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm w-full justify-center cursor-pointer"
                                >
                                    Xóa
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-sm overflow-hidden border border-gray-200 bg-black min-h-[300px] flex items-center">
                    <MediaDisplay
                        src={data.mediaType === 'video' ? data.video : data.image}
                        type={data.mediaType}
                        className="w-full object-contain"
                    />
                </div>

                <PostsState post={data} onCommentClick={handleOpenModal} />

                <div className="mt-2 text-sm">
                    <span className="font-semibold mr-2">{data.userId?.username || "null name"}</span>

                    {isEditing ? (
                        <div className="mt-2">
                            <textarea
                                className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                                rows={2}
                                value={editCaption}
                                onChange={(e) => setEditCaption(e.target.value)}
                            />
                            <div className="flex gap-2 mt-1 justify-end">
                                <button onClick={cancelEdit} className="text-xs px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Hủy</button>
                                <button onClick={handleUpdate} className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Lưu</button>
                            </div>
                        </div>
                    ) : (
                        <span className="whitespace-pre-wrap">{data.caption}</span>
                    )}
                </div>

                {statePost ? (
                    <button
                        onClick={handleOpenModal}
                        className="text-gray-500 text-sm mt-1 cursor-pointer"
                    >
                        View all {statePost.comments.length} comments
                    </button>
                ) : <Spinner />}
            </div>

            {isModalOpen && (
                <PostModal
                    post={data}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}