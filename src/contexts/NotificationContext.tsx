import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import socketService from "../services/socketService";
import { useAuth } from "./AuthContext";

interface Notification {
  id: string;
  type: "message" | "course" | "general";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

interface Props {
  children: ReactNode;
}

// Helper function to make a string key for deduplication
const notificationKey = (n: Omit<Notification, "id" | "timestamp" | "read">) => {
  // Use data._id if available (e.g., for messages/courses), otherwise fallback to type/message/title string combo
  if (n.data && (n.data._id || n.data.id)) {
    return `${n.type}_${n.data._id ?? n.data.id}`;
  }
  // fallback: combine type, title, message, something stable
  return `${n.type}_${n.title}_${n.message}`;
};

export const NotificationProvider: React.FC<Props> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Store seen notification keys to prevent duplicates on socket spam
  const seenKeysRef = useRef<Set<string>>(new Set());

  // Will clear seenKeysRef on logout, so on new user you can have fresh deduplication
  useEffect(() => {
    seenKeysRef.current.clear();
  }, [user?._id || user?.id]);

  // Central socket connection (no duplicates, and deduplication handling)
  useEffect(() => {
    if (!user) return;
    const socket = socketService.getSocket() || socketService.connect();
    if (!socket) return;

    // Cleanup old listeners before reattaching
    socket.off("new_message");
    socket.off("course_purchased");

    const handleNewMessage = (data: any) => {
      addNotification({
        type: "message",
        title: "New Message",
        message: `You have a new message from ${data.sender?.name || "Someone"}`,
        data,
      });
    };

    const handleCoursePurchased = (data: any) => {
      addNotification({
        type: "course",
        title: "Course Purchased",
        message: `${data.student?.name || "A student"} purchased your course: ${
          data.course?.title || "Unknown Course"
        }`,
        data,
      });
    };

    socket.on("new_message", handleNewMessage);
    socket.on("course_purchased", handleCoursePurchased);

    // 🔁 Rebind on reconnect
    socket.on("connect", () => {
      socket.off("new_message", handleNewMessage); // Prevent attach twice
      socket.off("course_purchased", handleCoursePurchased);
      socket.on("new_message", handleNewMessage);
      socket.on("course_purchased", handleCoursePurchased);
    });

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("course_purchased", handleCoursePurchased);
    };
  }, [user]);

  // Add notification, but prevent duplicates based on a key
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const key = notificationKey(notification);

    // If this notification has been added very recently, skip
    if (seenKeysRef.current.has(key)) {
      return;
    }

    // Also check if already present in the local array to catch edge cases on reload
    // Use only latest 30 notifications for this check to avoid growing arbitrarily
    const alreadyExists = notifications
      .slice(0, 30)
      .some(
        (n) =>
          n.type === notification.type &&
          n.title === notification.title &&
          n.message === notification.message &&
          (notification.data?.id || notification.data?._id
            ? n.data?.id === notification.data?.id ||
              n.data?._id === notification.data?._id
            : true)
      );

    if (alreadyExists) return;

    seenKeysRef.current.add(key);
    // Remove key after 1 minute so future same ones can appear (e.g., recurring notifications)
    setTimeout(() => {
      seenKeysRef.current.delete(key);
    }, 60000);

    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.ico",
        });
      } else if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  };

  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearNotification = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAllNotifications = () => setNotifications([]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
