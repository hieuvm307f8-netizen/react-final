import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bookmark, Grid3X3, SquareUserRound } from "lucide-react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import Archive from "../posts/Archive"
import ProfilePostGrid from "../posts/ProfilePostGrid"

export default function ProfileBody() {
    const { userId } = useParams();
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);
    const targetId = userId || currentUser?._id;
    const isOwnProfile = currentUser && targetId === currentUser._id;

    if (!targetId) return null;

    // Class chung cho các Tab Trigger để tái sử dụng và đồng bộ style
    const tabTriggerClass = "flex items-center gap-2 px-0 mx-4 sm:mx-8 cursor-pointer h-full rounded-none border-t border-transparent data-[state=active]:border-black data-[state=active]:text-black text-gray-400 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-none -mt-[1px]";
    const tabTextClass = "uppercase text-xs font-semibold tracking-widest hidden sm:block";

    return (
        <div className="w-full">
            <Tabs defaultValue="posts" className="w-full">
                {/* TabsList: Border trên cùng, nền trong suốt */}
                <TabsList className="w-full flex justify-center bg-transparent p-0 h-[52px] border-t border-gray-300 rounded-none">
                    
                    <TabsTrigger value="posts" className={tabTriggerClass}>
                        <Grid3X3 size={12} /> 
                        <span className={tabTextClass}>Posts</span>
                    </TabsTrigger>

                    {isOwnProfile && (
                        <TabsTrigger value="saved" className={tabTriggerClass}>
                            <Bookmark size={12} /> 
                            <span className={tabTextClass}>Saved</span>
                        </TabsTrigger>
                    )}

                    <TabsTrigger value="tagged" className={tabTriggerClass}>
                        <SquareUserRound size={12} /> 
                        <span className={tabTextClass}>Tagged</span>
                    </TabsTrigger>

                </TabsList>

                <div className="mt-4">
                    <TabsContent value="posts" className="focus-visible:ring-0">
                        <ProfilePostGrid userId={targetId} filter="all" />
                    </TabsContent>

                    {isOwnProfile && (
                        <TabsContent value="saved" className="focus-visible:ring-0">
                            <Archive />
                        </TabsContent>
                    )}

                    <TabsContent value="tagged" className="focus-visible:ring-0">
                        {/* Placeholder UI cho phần Tagged giống Instagram khi chưa có ảnh */}
                        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                            <div className="border-2 border-black rounded-full p-4 mb-2">
                                <SquareUserRound size={32} strokeWidth={1} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-extrabold text-3xl">Photos of you</span>
                                <span className="text-sm text-gray-500 max-w-xs">
                                    When people tag you in photos, they'll appear here.
                                </span>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}