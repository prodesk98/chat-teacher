from typing import Literal

from pydantic import BaseModel


class NewChatRequestSchema(BaseModel):
    uuid: str
    title: str


class NewAgentRequestSchema(BaseModel):
    role: Literal['user', 'assistant']
    content: str
