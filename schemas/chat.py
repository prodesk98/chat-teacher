from pydantic import BaseModel, Field


class ChatMessageSchema(BaseModel):
    id: int
    role: str
    content: str

class ChatResponseSchema(BaseModel):
    id: int
    uuid: str
    title: str
    messages: list[ChatMessageSchema]

class ChatCreateSchema(BaseModel):
    id: int
    uuid: str
    title: str


class MessageCreateSchema(BaseModel):
    id: int
    chat_id: int
    role: str
    content: str


class SpeakRequestSchema(BaseModel):
    content: str = Field(max_length=1024, description="Content to be spoken by the agent.")
