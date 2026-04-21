import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiCpu, FiSend, FiLoader, FiUser } from "react-icons/fi";

const AIAssistant = () => {
  
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Retrieve user data stored during Login
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userPrompt = input.trim();
    setInput("");

    const newMessages = [...messages, { role: "user", content: userPrompt }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await axios.post("/v1/aiRouter/ask", {
        prompt: userPrompt,
        chatId: chatId,
      });


      const result = response.data?.data;

      if (result && result.aiResponse) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.aiResponse,
          },
        ]);

        if (result.chat && result.chat._id) {
          setChatId(result.chat._id);
        }
      }
    } catch (error) {
      console.error(
        "AI Error:",
        error.response?.data?.message || error.message,
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting to Gemini. Please check your console.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white shadow-md">
          <FiCpu size={20} />
        </div>
        <div>
          <h2 className="font-bold text-gray-800">CineMind AI</h2>
          <p className="text-xs text-green-600 font-medium">
            Gemini 1.5 Flash Active
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Welcome, {user?.username || "Creator"}! 👋
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ready to build? I can help with MERN stack debugging, YouTube
                growth, or your IIIT Kota semester notes.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-red-600" : "bg-gray-200"}`}
              >
                {msg.role === "user" ? (
                  <FiUser className="text-white text-xs" />
                ) : (
                  <FiCpu className="text-gray-600 text-xs" />
                )}
              </div>
              <div
                className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === "user"
                    ? "bg-red-600 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <FiCpu className="text-gray-600 text-xs" />
            </div>
            <div className="p-4 rounded-2xl bg-gray-100 border flex items-center gap-2">
              <FiLoader className="animate-spin text-red-600" />
              <span className="text-sm text-gray-500 font-medium">
                Gemini is thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <div className="relative flex items-center max-w-4xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full p-4 pr-14 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl transition-all outline-none text-sm"
            placeholder="Ask anything..."
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`absolute right-3 p-2 rounded-xl transition-all ${
              loading || !input.trim()
                ? "text-gray-300"
                : "text-red-600 hover:bg-red-50"
            }`}
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
