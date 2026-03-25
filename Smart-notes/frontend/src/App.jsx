import { useState } from "react";
import { api } from "./services/api";
import AiPanel from "./components/AiPanel";

export default function App() {

    const [noteContent, setNoteContent] = useState("");
    const [summary, setSummary]         = useState("");
    const [tags, setTags]               = useState([]);
    const [loading, setLoading]         = useState({});


    const setLoad = (key, val) =>
        setLoading((prev) => ({ ...prev, [key]: val}));

    async function handleSummarize() {
        setLoad("summary", true);
        
        try {
            const data = await api.summarize(noteContent);
            setSummary(data.summary);
        } finally {
            setLoad("summary", false);
        }
    }

    async function handleTags() {
        setLoad("tags", true);
        try {
            const data = await api.getTags(noteContent);
            setTags(data.tags);
        } finally {
            setLoad("tags", false);
        }
    }

    return (
        <div>
            <h1>Notas Inteligente</h1>

            <textarea 
            value={noteContent} 
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Escribe tu nota aquí..."
            rows={8}
            />


            <div className="actions">
                <button onClick={handleSummarize} disabled={loading.summary}>
                    {loading.summary ? "Resumiendo..." : "Resumir"}
                </button>

                <button onClick={handleTags} disabled={loading.tags}>
                    {loading.tags ? "Analizando..." : "Generar etiquetas"}
                </button>
            </div>

            {summary && (
                <div className="result-box">
                    <h3>Resumen</h3>
                    <p>{summary}</p>
                </div>
            )}

            {tags.length > 0 && (
                <div className="tags">
                    {tags.map((tag) =>(
                        <span key={tag} className="tag"># {tag}</span>
                    ))}
                </div>
            )}

            {noteContent && <AiPanel noteContent={noteContent} />}
        </div>
    );
}