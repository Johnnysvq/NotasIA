import anthropic
import json

# Initialize the client just once
# Automatically loads the API key from the environment variable ANTHROPIC_API_KEY
client = anthropic.Anthropic()

# Function 1: Generate a summary of the note
def summarize_note(note_content: str) -> str:
    """
    Recibe el texto de una nota y devuelve un resumen.
    Usamos temperature=0.3 porque queremos precisión, no creatividad.    
    """

    message = client.messages.create(
        model = "claude-sonnet-4-20250514",
        max_tokens = 300,
        system = """Eres un asistente de productividad experto.
        Tu trabajo es resumir notas de forma clara y concisa.
        - Responde SIEMPRE en el mismo idioma que la nota
        - Máximo 3 oraciones
        - Enfócate en los puntos accionables""",
        messages = [
            {
                "role": "user",
                "content": f"Resume esta nota:\n\n{note_content}"
            }
        ]
    )

    return message.content[0].text

# Function 2: Generate tags automatically
def generate_tags(note_content: str) -> list[str]:
    """
    Pide a la IA que responda en JSON para obtener
    datos estructurados faciles de usar en react.
    """
    message = client.messages.create(
        model = "claude-sonnet-4-20250514",
        max_tokens = 150,
        system = """Eres un sistema de clasificación de notas.
        Responde ÚNICAMENTE con JSON válido, sin texto adicional.
        Sin markdown, sin explicaciones, solo el JSON.""",
        messages = [
            {
                "role": "user",
                "content": f"""Analiza esta nota y genera etiquetas.
                Nota: {note_content}

                Responde con este formato exacto:
                {{"tags": ["etiqueta1", "etiqueta2", "etiqueta3"]}}

                Máximo 4 etiquetas, una o dos palabras cada una."""
            }
        ]
    )

    raw = message.content[0].text
    data = json.loads(raw)
    return data["tags"]


# Function 3: Chat about a note
def chat_about_note(note_content: str, conversation_history: list) -> str:
    """
    Permite al usuario hacer preguntas sobre su nota.
    conversation_history es una lista de mensajes previos
    que mandamos completa cada vez.
    """

    message = client.messages.create(
        model = "claude-sonnet-4-20250514",
        max_tokens = 500,
        system = f"""Eres un asistente personal inteligente.
        El usuario está trabajando en esta nota:

        ---
        {note_content}
        ---

        Responde preguntas sobre la nota, sugiere mejoras,
        ayuda a crear tareas derivadas de ella.
        Sé conciso y práctico.""",

        messages = conversation_history
    )
    return message.content[0].text