import React, { useState } from 'react';
import { Send, User } from 'lucide-react';

const TutorMessages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  
  const conversations = [
    {
      id: '1',
      studentName: 'Alice Johnson',
      lastMessage: 'Thank you for the explanation!',
      time: '2 hours ago',
      unread: 2
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      lastMessage: 'When is the next assignment due?',
      time: '1 day ago',
      unread: 0
    },
    {
      id: '3',
      studentName: 'Carol Davis',
      lastMessage: 'I need help with the project',
      time: '2 days ago',
      unread: 1
    }
  ];

  const messages = [
    {
      id: '1',
      sender: 'student',
      content: 'Hi! I have a question about the React hooks lesson.',
      time: '10:30 AM'
    },
    {
      id: '2',
      sender: 'tutor',
      content: 'Sure! What specifically would you like to know?',
      time: '10:32 AM'
    },
    {
      id: '3',
      sender: 'student',
      content: 'I\'m having trouble understanding useEffect dependencies.',
      time: '10:35 AM'
    },
    {
      id: '4',
      sender: 'tutor',
      content: 'Great question! The dependency array controls when useEffect runs. Let me explain...',
      time: '10:37 AM'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          </div>
          <div className="overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedChat === conversation.id ? 'bg-yellow-50 border-yellow-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.studentName}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="bg-yellow-600 text-white text-xs rounded-full px-2 py-1">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    <p className="text-xs text-gray-400">{conversation.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {conversations.find(c => c.id === selectedChat)?.studentName}
                </h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'tutor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'tutor'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'tutor' ? 'text-yellow-100' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorMessages;