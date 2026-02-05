import Avatar from "../shared/Avatar";
import FollowButton from "../followButton/FollowButton";
import { X } from "lucide-react";

export default function FollowState({ title, users, onClose }: any) {
    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-sm max-h-[400px] overflow-hidden flex flex-col">
                <div className="p-3 border-b flex justify-between items-center">
                    <div className="w-6" />
                    <span className="font-bold">{title}</span>
                    <X className="cursor-pointer" onClick={onClose} />
                </div>
                <div className="overflow-y-auto p-2">
                    {users.map((u: any) => (
                        <div key={u._id} className="flex items-center justify-between p-2">
                            <div className="flex items-center gap-3">
                                <Avatar img={u.profilePicture} className="w-10 h-10" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">{u.username}</span>
                                    <span className="text-xs text-gray-500">{u.fullName}</span>
                                </div>
                            </div>
                            <FollowButton userId={u._id} isFollowing={u.isFollowing} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}