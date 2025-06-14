from pydantic import BaseModel


class ChatMessageSchema(BaseModel):
    id: int
    role: str
    content: str

class ChatResponseSchema(BaseModel):
    id: int
    uuid: str
    title: str
    messages: list[ChatMessageSchema]