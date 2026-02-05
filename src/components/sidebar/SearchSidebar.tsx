import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, clearSearchResults } from "@/store/slice/userSlice";
import Avatar from "@/components/shared/Avatar";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { type AppDispatch, type RootState } from "@/store/store";
import { addHistoryItem, clearAllHistory, deleteHistoryItem, fetchSearchHistory } from "@/store/slice/searchHistorySlice";
import { Spinner } from "../ui/spinner";

interface SearchSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchSidebar({ isOpen, onClose }: SearchSidebarProps) {
    const [data, setData] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const { searchResults, loading } = useSelector((state: RootState) => state.user);
    const { historyItems } = useSelector((state: RootState) => state.searchHistory);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchSearchHistory());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        const debounceSearch = setTimeout(() => {
            if (data.trim()) {
                dispatch(searchUsers(data));
            } else {
                dispatch(clearSearchResults());
            }
        }, 500);
        return () => clearTimeout(debounceSearch);
    }, [data, dispatch]);

    const handleSelectUser = (user: any) => {
        dispatch(addHistoryItem({
            searchedUserId: user._id,
            searchQuery: data || user.username
        }));
        onClose();
    };

    return (
        <Sheet open={isOpen} modal={false} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="left" className="w-[400px] ml-0 p-0 border-r border-gray-200 z-[100] rounded-r-2xl h-full">
                <SheetHeader className="p-6 pb-2 border-b border-gray-100">
                    <SheetTitle className="text-2xl font-bold mb-4">Search</SheetTitle>
                    <div className="relative">
                        <Input
                            placeholder="Search"
                            className="bg-gray-100 border-none pl-4 rounded-lg h-10"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                        />
                        {data && (
                            <X
                                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                                size={18}
                                onClick={() => { setData(""); dispatch(clearSearchResults()); }}
                            />
                        )}
                    </div>
                </SheetHeader>

                <div className="flex flex-col h-full overflow-y-auto pb-20">
                    {!data && (
                        <div className="py-4">
                            <div className="px-6 flex justify-between items-center mb-2">
                                <span className="text-sm font-bold">Recent</span>
                                {historyItems.length > 0 && (
                                    <button
                                        onClick={() => dispatch(clearAllHistory())}
                                        className="text-xs font-semibold text-blue-500 hover:text-blue-700 cursor-pointer"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {historyItems.length === 0 ? (
                                <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">
                                    No recent search here
                                </div>
                            ) : (
                                historyItems.map((item: any) => (
                                    <div key={item._id} className="group flex items-center justify-between px-6 py-2 hover:bg-gray-50 transition-colors">
                                        <NavLink
                                            to={`/profile/${item.searchedUserId?._id}`}
                                            className="flex items-center gap-3 flex-1"
                                            onClick={onClose}
                                        >
                                            <Avatar img={item.searchedUserId?.profilePicture} className="w-11 h-11" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{item.searchedUserId?.username}</span>
                                                <span className="text-sm text-gray-500">{item.searchedUserId?.fullName}</span>
                                            </div>
                                        </NavLink>
                                        <button
                                            onClick={() => dispatch(deleteHistoryItem(item._id))}
                                            className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {loading && data && <Spinner className="p-6 text-center text-gray-500">loading...</Spinner>}

                    {searchResults.length > 0 && (
                        <div className="mt-2">
                            {searchResults.map((user: any) => (
                                <NavLink
                                    to={`/profile/${user._id}`}
                                    key={user._id}
                                    onClick={() => handleSelectUser(user)}
                                    className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <Avatar img={user.profilePicture} className="w-12 h-12" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">{user.username}</span>
                                        <span className="text-sm text-gray-500">{user.fullName}</span>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}