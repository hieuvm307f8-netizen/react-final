import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { 
    getConversations, 
    createOrGetConversation, 
    getMessages, 
    sendTextMessage, 
    sendImageMessage, 
    markAsRead 
} from "@/store/slice/chatSlice";
import useChatSocket from "@/hooks/useChatSocket";
import Avatar from "@/components/shared/Avatar";
import { Send, Image as ImageIcon, Edit, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import type { AppDispatch, RootState } from "@/store/store";
import MediaDisplay from "@/components/img/video/MediaDisplay";

const getPartner = (participants: any[], currentUserId: string) => {
    if (!participants || participants.length === 0) return {};
    return participants.find(p => p._id !== currentUserId) || participants[0];
};

export default function ChatLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { conversationId } = useParams();

    const { 
        conversations, 
        currentConversation, 
        messages, 
        messagesLoading, 
        sending, 
        typingUsers 
    } = useSelector((state: RootState) => state.chat);
    const { currentUser } = useSelector((state: RootState) => state.auth);

    const [inputText, setInputText] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const typingTimeoutRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { sendTypingSignal } = useChatSocket();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        dispatch(getConversations());
    }, [dispatch]);

    useEffect(() => {
        if (conversationId) {
            dispatch(getMessages(conversationId));
            const selected = conversations.find(c => c._id === conversationId);
            if (selected && currentUser) {
                const partner = getPartner(selected.participants, currentUser._id);
                dispatch(createOrGetConversation(partner._id));
            }
        }
    }, [conversationId, dispatch, conversations.length]);

    useEffect(() => {
        if (conversationId && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            const senderId = typeof lastMessage.senderId === 'object' 
                ? lastMessage.senderId._id 
                : lastMessage.senderId;
                
            if (senderId !== currentUser?._id && !lastMessage.isRead) {
                dispatch(markAsRead(lastMessage._id));
            }
        }
    }, [messages, conversationId, currentUser?._id, dispatch]);

    const handleSelectConversation = (id: string) => {
        navigate(`/messages/${id}`);
        setInputText("");
        handleRemoveImage();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
        if (!currentConversation || !currentUser) return;
        const partner = getPartner(currentConversation.participants, currentUser._id);
        sendTypingSignal(currentConversation._id, partner._id, true);
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingSignal(currentConversation._id, partner._id, false);
        }, 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
        e.target.value = "";
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!currentConversation || !currentUser) return;
        const partner = getPartner(currentConversation.participants, currentUser._id);
        
        if (selectedFile) {
            const formData = new FormData();
            formData.append("conversationId", currentConversation._id);
            formData.append("recipientId", partner._id);
            formData.append("messageType", "image");
            formData.append("image", selectedFile);
            dispatch(sendImageMessage(formData));
            handleRemoveImage();
        } else if (inputText.trim()) {
            dispatch(sendTextMessage({
                conversationId: currentConversation._id,
                recipientId: partner._id,
                content: inputText
            }));
            setInputText("");
            sendTypingSignal(currentConversation._id, partner._id, false);
        }
    };

    if (!currentUser) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }
    const currentFriend = currentConversation ? getPartner(currentConversation.participants, currentUser._id) : null;

    return (
        <div className="flex h-screen w-full bg-white">
            <div className="flex flex-1 overflow-hidden relative">
                <div className="w-[350px] flex flex-col border-r-1 border-gray-200 h-full">
                    <div className="p-5 pt-8 flex justify-between items-center pb-4">
                        <h1 className="text-xl font-bold truncate">{currentUser.username}</h1>
                        <Edit className="w-6 h-6 cursor-pointer" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((conversation) => {
                            const partner = getPartner(conversation.participants, currentUser._id);
                            const isSelected = conversationId === conversation._id;
                            const hasUnread = conversation.unreadCount > 0 && conversation.lastMessage?.senderId !== currentUser._id;
                            
                            return (
                                <div
                                    key={conversation._id}
                                    onClick={() => handleSelectConversation(conversation._id)}
                                    className={`flex items-center p-3 px-5 gap-3 cursor-pointer ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="relative">
                                        <Avatar img={partner.profilePicture} className="w-12 h-12 flex-shrink-0" />
                                        {hasUnread && !isSelected && (
                                            <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className={`truncate text-sm ${hasUnread ? 'font-bold' : 'font-medium'}`}>
                                            {partner.fullName || partner.username}
                                        </div>
                                        <div className={`truncate text-sm ${hasUnread ? 'font-bold text-black' : 'text-gray-500'}`}>
                                            {typingUsers[conversation._id] ? (
                                                <span className="text-blue-500">typing...</span>
                                            ) : (
                                                <>
                                                    {conversation.lastMessage?.senderId === currentUser._id && "You: "}
                                                    {conversation.lastMessage?.messageType === 'image' ? "Sent a photo" : conversation.lastMessage?.content}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-white h-full relative">
                    {conversationId && currentConversation ? (
                        <>
                            <div className="h-[75px] px-5 border-b border-gray-200 flex items-center justify-between bg-white z-10">
                                <div className="flex items-center gap-3">
                                    <Avatar img={currentFriend?.profilePicture} className="w-10 h-10" />
                                    <div>
                                        <div className="font-semibold text-sm">{currentFriend?.fullName || currentFriend?.username}</div>
                                        <div className="text-xs text-gray-500">
                                            <span>active now</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                                {messagesLoading && messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Spinner />
                                    </div>
                                ) : (
                                    messages.map((message, index) => {
                                        const sender = typeof message.senderId === 'object' ? message.senderId : { _id: message.senderId };
                                        const isMe = sender._id === currentUser._id;
                                        return (
                                            <div key={message._id || index} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
                                                {!isMe && <Avatar img={sender.profilePicture} className="w-7 h-7 mr-2 self-end mb-1" />}
                                                <div className={`max-w-[70%] ${message.messageType === 'image' ? '' : 'px-4 py-2 rounded-[22px]'} ${
                                                    isMe 
                                                    ? (message.messageType === 'image' ? '' : 'bg-[#3797f0] text-white') 
                                                    : (message.messageType === 'image' ? '' : 'bg-[#efefef] text-black')
                                                }`}>
                                                    {message.messageType === 'image' ? (
                                                        <MediaDisplay src={message.imageUrl} type="image" className="rounded-xl max-w-sm border border-gray-200" />
                                                    ) : (
                                                        <span className="text-[15px] break-words">{message.content}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 pt-2">
                                {previewUrl && (
                                    <div className="mb-3 relative inline-block">
                                        <img src={previewUrl} alt="Preview" className="h-32 rounded-lg border object-cover" />
                                        <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                <div className="min-h-[44px] border border-gray-300 rounded-[22px] flex items-center px-4 py-1 gap-2">
                                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                                    <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={sending}>
                                        <ImageIcon size={30} className={selectedFile ? "text-blue-500" : ""} />
                                    </Button>
                                    <input
                                        type="text"
                                        className="flex-1 outline-none text-sm bg-transparent py-2"
                                        placeholder="Message..."
                                        value={inputText}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button 
                                        onClick={() => handleSendMessage()} 
                                        disabled={sending || (!inputText.trim() && !selectedFile)} 
                                        className={`font-semibold text-sm px-2 ${(!inputText.trim() && !selectedFile) ? 'text-gray-300' : 'text-[#0095f6]'}`}
                                    >
                                        {sending ? "..." : "Send"}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-4">
                                <Send size={50} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-xl font-medium">Your messages</h2>
                            <p className="text-gray-500 text-sm mt-1">Send a message to start a chat.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}