const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  messageType: "text" | "image" | "file";
  status: "sent" | "delivered" | "read" | "failed";
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  name: string;
  email: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  lastMessageId: string | null;
}

export interface SendMessageData {
  receiverId: string;
  content: string;
  messageType?: "text" | "image" | "file";
}

class MessagesAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  }

  async getConversation(
    otherUserId: string,
    page = 1,
    limit = 50
  ): Promise<{
    messages: Message[];
    pagination: {
      page: number;
      limit: number;
      hasMore: boolean;
    };
  }> {
    return this.request(
      `/messages/conversation/${otherUserId}?page=${page}&limit=${limit}`
    );
  }

  async getConversations(): Promise<{ conversations: Conversation[] }> {
    return this.request("/messages/conversations");
  }

  async sendMessage(data: SendMessageData): Promise<{ message: Message }> {
    return this.request("/messages/send", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async markAsRead(otherUserId: string): Promise<{ message: string }> {
    return this.request(`/messages/conversation/${otherUserId}/read`, {
      method: "PUT",
    });
  }

  async getUnreadCount(): Promise<{ unreadCount: number }> {
    return this.request("/messages/unread-count");
  }

  async getRecentMessages(limit = 10): Promise<{ messages: Message[] }> {
    return this.request(`/messages/recent?limit=${limit}`);
  }
}

export default new MessagesAPI();
