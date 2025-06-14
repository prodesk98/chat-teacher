from typing import Literal

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

class ChatCreateSchema(BaseModel):
    id: int
    uuid: str
    title: str


class MessageCreateSchema(BaseModel):
    id: int
    chat_id: int
    role: str
    content: str
