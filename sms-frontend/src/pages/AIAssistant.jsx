import { useState } from "react";
import '../css/AIAssistant.css';
import api from '../api/api.js';
import { useContext } from "react";
import { AuthContext } from '../store/AuthContext.jsx';
import ReactMarkdown from 'react-markdown';
import { useEffect, useRef } from "react";

function AIAssistant() {
    const { token } = useContext(AuthContext);

    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        {
            role: 'ai',
            content: 'Hello 👋 I am your AI Assistant. Ask me anything!'
        }
    ]);

    const [loading, setLoading] = useState(false);

    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }

    }, [chat])


    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = message;

        setChat(prev => [
            ...prev,
            {
                role: 'user',
                content: userMessage
            }
        ]);

        setMessage('');

        try {
            setLoading(true);

            const res = await api.post(`/ai/chat`, { userMessage });

            const aiMessage = res.data.reply;

            setChat(prev => [
                ...prev,
                {
                    role: 'ai',
                    content: res.data.reply,
                }
            ])

        } catch (err) {
            const apiMessage = err.response?.data?.message || "";

            let errorMessage = "Sorry, AI is not responding 😢";


            if (apiMessage.includes("rate_limit_exceeded")) {
                errorMessage =
                    "⚠️ AI limit reached. Please try again later.";
            }

            setChat(prev => [
                ...prev,
                {
                    role: 'ai',
                    content: errorMessage,
                }
            ])
        } finally {
            setLoading(false);
        }

    }

    return (

        <div className="ai-container">
            <div className="chat-box" ref={chatBoxRef}>

                {chat?.map((msg, index) => (

                    <div
                        key={index}
                        className={
                            msg.role === "user"
                                ? "message user"
                                : "message ai"
                        }
                    >
                        <ReactMarkdown>
                            {msg.content}
                        </ReactMarkdown>
                    </div>

                ))}

                {
                    loading && <div className="message ai">
                        AI is typing...
                    </div>
                }

            </div>

            <div className="input-area">

                <input
                    type="text"
                    placeholder="Ask something..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter")
                            sendMessage();
                    }}
                />

                <button onClick={sendMessage}>
                    Send
                </button>

            </div>


        </div>

    );
}

export default AIAssistant;