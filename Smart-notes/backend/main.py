from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_service import summarize_note, generate_tags, chat_about_note

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class NoteRequest(BaseModel):
    content: str

class ChatRequest(BaseModel):
    note_content: str
    history: list

# ENDPOINT 1: Summarize
@app.post("/api/summarize")
async def summarize(req: NoteRequest):
    try:
        summary = summarize_note(req.content)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ENDPOINT 2: Tag notes
@app.post("/api/tags")
async def get_tags(req: NoteRequest):
    try:
        tags = generate_tags(req.content)
        return {"tags": tags}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ENDPOINT 3: Chat
@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        response = chat_about_note(req.note_content, req.history)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

