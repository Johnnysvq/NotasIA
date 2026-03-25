const BASE_URL = "http://localhost:8000/api";

async function post(endpoint, data) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
}

export const api = {
    summarize: (content) => post("/summarize", {content}),
    getTags: (content) => post("/tags", {content}),
    chat: (note_content, history) => post("/chat", {note_content, history}),
};