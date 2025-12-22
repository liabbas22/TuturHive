import React, { useState, useEffect, useRef } from "react";
import { Send, User, Check, CheckCheck, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Socket } from "socket.io-client";
import messagesAPI, { Message, Conversation } from "../apis/messages";
import socketService from "../services/socketService";

const StudentMessages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = user ? user.id : null;

  useEffect(() => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!user || !currentUserId) return;
    const newSocket = socketService.connect(currentUserId ?? undefined);
    if (!newSocket) return;

    const onNewMessage = (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      loadConversations();
      loadUnreadCount();
      if (
        message.sender?._id !== currentUserId &&
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        new Notification("New Message", {
          body: `${message?.sender?.name ?? "New message"}: ${message.content}`,
          icon: "/favicon.ico",
        });
      }
    };

    const onMessageSent = (data: {
      _id: string;
      status: string;
      createdAt: string;
      realId?: string;
    }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data._id || msg._id === data.realId
            ? {
                ...msg,
                status: data.status as any,
                createdAt: data.createdAt || msg.createdAt,
                _id: data._id,
              }
            : msg
        )
      );
    };

    const onMessageDelivered = (data: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, status: "delivered" } : msg
        )
      );
    };

    const onMessagesRead = (data: { byUserId: string; readAt: string }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (
            msg.sender?._id === currentUserId &&
            msg.receiver?._id === data.byUserId
          ) {
            return { ...msg, status: "read", isRead: true };
          }
          return msg;
        })
      );
    };

    newSocket.on("new_message", onNewMessage);
    newSocket.on("message_sent", onMessageSent);
    newSocket.on("message_delivered", onMessageDelivered);
    newSocket.on("messages_read", onMessagesRead);

    setSocket(newSocket);

    return () => {
      newSocket.off("new_message", onNewMessage);
      newSocket.off("message_sent", onMessageSent);
      newSocket.off("message_delivered", onMessageDelivered);
      newSocket.off("messages_read", onMessagesRead);
    };
  }, [user, currentUserId]);

  useEffect(() => {
    if (user && currentUserId) {
      loadConversations();
      loadUnreadCount();
    }
  }, [user, currentUserId]);

  useEffect(() => {
    if (!selectedChat || !currentUserId) return;
    loadMessages(selectedChat);
    setTimeout(() => markAsRead(selectedChat), 350);
    socket?.emit("joinPrivateRoom", {
      user1: currentUserId,
      user2: selectedChat,
    });
  }, [selectedChat, currentUserId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markAsRead = async (otherUserId: string) => {
    try {
      await messagesAPI.markAsRead(otherUserId);
      socket?.emit("messages_read", { readerId: currentUserId, otherUserId });
      setMessages((prev) =>
        prev.map((m) =>
          m.sender._id === otherUserId
            ? { ...m, isRead: true, status: "read" }
            : m
        )
      );
      loadUnreadCount();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUserId) return;
    const messageContent = newMessage.trim();
    setNewMessage("");
    const tempMessage: Message = {
      _id: `temp_${Date.now()}`,
      sender: { _id: currentUserId, name: user?.name ?? "", email: user?.email ?? "" },
      receiver: { _id: selectedChat, name: "", email: "" },
      content: messageContent,
      messageType: "text",
      status: "sent",
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setTimeout(scrollToBottom, 0);
    if (socket && (socket.connected ?? false)) {
      socket.emit("private_message", { toUserId: selectedChat, message: messageContent, messageType: "text", tempId: tempMessage._id });
    } else {
      try {
        const res = await messagesAPI.sendMessage({ receiverId: selectedChat, content: messageContent });
        if (res?.message) setMessages((prev) => prev.map((m) => (m._id === tempMessage._id ? res.message : m)));
      } catch (err) { console.error(err); }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const loadConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      const allConversations = response.conversations || [];
      setConversations(allConversations);
      if (allConversations.length > 0 && !selectedChat) setSelectedChat(allConversations[0]._id);
    } catch { setConversations([]); }
  };

  const loadMessages = async (otherUserId: string) => {
    try { setIsLoading(true); const response = await messagesAPI.getConversation(otherUserId); setMessages(response.messages ?? []); }
    catch { setMessages([]); }
    finally { setIsLoading(false); }
  };

  const loadUnreadCount = async () => { try { const response = await messagesAPI.getUnreadCount(); setUnreadCount(response.unreadCount ?? 0); } catch { } };

  const getMessageStatusIcon = (status: string, isRead: boolean) => isRead ? <CheckCheck className="h-4 w-4 text-[blue]" /> : status === "delivered" ? <CheckCheck className="h-4 w-4 text-gray-400" /> : status === "sent" ? <Check className="h-4 w-4 text-gray-400" /> : <Clock className="h-4 w-4 text-gray-400" />;

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 24) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    else if (diffInHours < 168) return date.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
    else return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations Sidebar */}
        <div className={`absolute z-20 inset-y-0 left-0 transform ${selectedChat ? '-translate-x-full sm:translate-x-0' : 'translate-x-0'} sm:relative sm:translate-x-0 transition-transform duration-200 ease-in-out w-64 bg-gray-50 border-r border-gray-200`}>
          <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            {unreadCount > 0 && <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">{unreadCount}</span>}
          </div>
          <div className="overflow-y-auto h-full">
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => setSelectedChat(conversation._id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors ${selectedChat === conversation._id ? "bg-green-50 border-green-200" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{conversation.name}</p>
                      <span className="text-xs text-gray-500 hidden lg:block">{formatTime(conversation.lastMessageTime)}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate hidden lg:block">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 mt-1">{conversation.unreadCount}</span>}
                  </div>
                </div>
              </div>
            ))}
            {conversations.length === 0 && <div className="p-4 text-sm text-gray-500 text-center">No conversations yet.</div>}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col ml-0 sm:ml-64 relative">
          {selectedChat ? (
            <>
              <div className="p-2 border-b border-gray-200 bg-white shadow-sm flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 md:h-6 md:w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-md font-sans font-medium text-gray-900">
                    {conversations.find((c) => c._id === selectedChat)?.name || "Student"}
                  </h3>
                  <p className="text-[10px] text-gray-500"> Online</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No messages yet. Start a conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const msgSenderId = message?.sender?._id;
                    const isOwnMessage = !!(currentUserId && msgSenderId === currentUserId);
                    return (
                      <div key={message._id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isOwnMessage ? "bg-blue-500 text-white rounded-br-md" : "bg-white text-gray-900 rounded-bl-md shadow-sm"}`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
                            <span className="text-xs">{formatTime(message.createdAt)}</span>
                            {isOwnMessage && getMessageStatusIcon(message.status, message.isRead)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-gray-200 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMessages;
