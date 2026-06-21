import { useState } from "react";
import '../css/AIAssistant.css';
import axios from 'axios';
import { useContext } from "react";
import { AuthContext } from '../store/AuthContext.jsx';
import ReactMarkdown from 'react-markdown';
import { useEffect } from "react";

function AIAssistant() {
    const { token } = useContext(AuthContext);

    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        {
            role: 'ai',
            content: 'Hello 👋 I am your AI Assistant. Ask me anything!'
        }
    ]);
    
    const [loading, setLoading] = useState(true);


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
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/chat`, { message: userMessage }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const aiMessage = res.data.reply;

            setChat(prev => [
                ...prev,
                {
                    role: 'ai',
                    content: res.data.reply,
                }
            ])

        } catch (err) {
            console.log(err);

            setChat(prev => [
                ...prev,
                {
                    role: 'ai',
                    content: "Sorry, AI is not responding 😢",
                }
            ])
        }

    }

    return (

        <div className="ai-container">
            <div className="chat-box">

                {
                    loading && <div className="ai-spinner-container">
                        <div className="spinner-border ai-spinner" role="status"></div>
                    </div>
                }

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