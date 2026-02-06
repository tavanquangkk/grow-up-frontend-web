import React, { useState, useEffect, useRef } from 'react';
import { getChatHistory } from '../../api/chat';
import { getAccessToken, getUserId } from '../../utils/token';
import { API_CONFIG } from '../../core/config/apiConfig';
import { MdSend, MdPerson } from 'react-icons/md';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef(null);
  const currentUserId = getUserId();

  useEffect(() => {
    // 履歴の取得
    const fetchHistory = async () => {
      try {
        const history = await getChatHistory();
        if (history && history.messages) {
          setMessages(history.messages.reverse()); // 古い順に表示
        }
      } catch (err) {
        console.error('Failed to fetch chat history', err);
      }
    };

    fetchHistory();

    // WebSocketの接続
    const token = getAccessToken();
    const ws = new WebSocket(`${API_CONFIG.wsBaseUrl}/chat?token=${token}`);

    ws.onopen = () => console.log('WebSocket Connected');
    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMessage]);
    };
    ws.onclose = () => console.log('WebSocket Disconnected');

    setSocket(ws);

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket) return;

    const messagePayload = {
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    socket.send(JSON.stringify(messagePayload));
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white mr-3">
          <MdSend className="rotate-[-45deg]" size={18} />
        </div>
        <h2 className="font-bold text-gray-800">全社チャットルーム</h2>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30"
      >
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-auto mb-1">
                    <MdPerson className="text-gray-400" />
                  </div>
                )}
                <div className={`mx-2 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isMe && <span className="text-[10px] text-gray-400 ml-1 mb-1">{msg.senderName}</span>}
                  <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    isMe 
                      ? 'bg-orange-500 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-gray-300 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-50 flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-12 h-12 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white rounded-2xl flex items-center justify-center shadow-md transition-all active:scale-90"
        >
          <MdSend size={24} className="ml-1" />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
