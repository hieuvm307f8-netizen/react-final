import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { receiveNewMessage, setTyping } from "@/store/slice/chatSlice";
import type { RootState } from "@/store/store";

const BASE_URL = "https://instagram.f8team.dev";
const useChatSocket = () => {
    const dispatch = useDispatch();
    const { accessToken } = useSelector((state: RootState) => state.auth);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!accessToken) return;

        if (!socketRef.current) {
            socketRef.current = io(BASE_URL, {
                auth: { token: accessToken },
                transports: ["websocket"],
            });
        }

        const socket = socketRef.current;

        socket.on("new_message", (message) => {
            console.log("Realtime message received:", message);
            dispatch(receiveNewMessage(message));
        });

        socket.on("user_typing", ({ conversationId }) => {
            dispatch(setTyping({ conversationId, isTyping: true }));
        });

        socket.on("user_stop_typing", ({ conversationId }) => {
            dispatch(setTyping({ conversationId, isTyping: false }));
        });

        return () => {
            socket.off("new_message");
            socket.off("user_typing");
            socket.off("user_stop_typing");
        };
    }, [accessToken, dispatch]);

    const sendTypingSignal = (conversationId: string, recipientId: string, isTyping: boolean) => {
        const event = isTyping ? "typing" : "stop_typing";
        socketRef.current?.emit(event, { conversationId, recipientId });
    };

    return { socket: socketRef.current, sendTypingSignal };
};

export default useChatSocket;