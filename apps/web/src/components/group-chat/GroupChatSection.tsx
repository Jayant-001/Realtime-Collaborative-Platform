import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Users, Settings } from 'lucide-react';

// Enhanced Message Interface
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

// Chat Tab Component with Advanced Messaging
const GroupChatSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock current user (in real app, this would come from authentication context)
  const currentUser = {
    id: 'user1',
    name: 'You'
  };

  // Sample initial messages to demonstrate design
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        senderId: 'user2',
        senderName: 'John Doe',
        content: 'Hey everyone, welcome to the chat!',
        timestamp: new Date(),
        isCurrentUser: false
      },
      {
        id: '2',
        senderId: 'user1',
        senderName: 'You',
        content: 'Hi there! Excited to be here.',
        timestamp: new Date(),
        isCurrentUser: true
      }
    ];
    setMessages(initialMessages);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: `${messages.length + 1}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage,
      timestamp: new Date(),
      isCurrentUser: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[70%] p-3 rounded-lg shadow-sm
                ${msg.isCurrentUser 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border border-gray-200'}
              `}
            >
              {/* Message Header */}
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-sm">
                  {msg.isCurrentUser ? 'You' : msg.senderName}
                </span>
                <span className="text-xs opacity-70">
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>

              {/* Message Content */}
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 transition-all"
          />
          <button 
            onClick={sendMessage}
            className="
              bg-blue-500 text-white p-2 rounded-lg 
              hover:bg-blue-600 transition-colors
              flex items-center justify-center
            "
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatSection;