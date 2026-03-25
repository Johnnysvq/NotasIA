import { useState } from "react";
import { api } from "../services/api";

export default function AiPanel({ noteContent }) {

    const [history, setHistory] = useState ([]);
    const [input, setInput]     = useState("");
    const [loading, setLoading] = useState(false);

    async function sendMessage() {
        if (!input.trim() || !noteContent) return;

        const userMessage = { role: "user", content: input };

        const newHistory = [...history, userMessage];
        setHistory(newHistory);
        setInput("");
        setLoading(true);

        try {
            const data = await api.chat(noteContent, newHistory);

            setHistory([
                ...newHistory,
                {role: "assistant", content: data.response}
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="ai-panel">
            <h3>Pregúntale a la IA sobre esta nota</h3>
            <div className="message">
                {history.map((msg, i) => (
                    <div key={i} className={`message ${msg.role}`}>
                        <strong>{msg.role === "user" ? "Tú" : "IA"}:</strong>
                        <p>{msg.content}</p>
                    </div>
                ))}
                {loading && <p className="loading">IA escribiendo...</p>}
            </div>

            <div className="input-row">
                <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="¿Qué tareas debo crear? ¿Cuál es la prioridad?"
                />
                <button onClick={sendMessage} disabled={loading}>
                    Enviar
                </button>
            </div>
        </div>
    );
}