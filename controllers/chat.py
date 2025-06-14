from asyncio import to_thread

from sqlalchemy.orm import Session
from databases.sessions import Chat, Message
from schemas import ChatResponseSchema, ChatMessageSchema


class ChatController:
    def __init__(self, db: Session):
        self._db = db

    def create_chat(self, uuid: str, title: str) -> dict:
        try:
            chat = Chat(uuid=uuid, title=title)
            self._db.add(chat)
            self._db.commit()
            self._db.refresh(chat)
            return {
                "id": chat.id,
                "uuid": chat.uuid,
                "title": chat.title
            }
        except Exception as e:
            self._db.rollback()
            raise e
        finally:
            self._db.close()

    def get_chat(self, uuid: str) -> ChatResponseSchema | None:
        try:
            chat = self._db.query(Chat).filter(Chat.uuid == uuid).first()
            if chat is None:
                return None
            return ChatResponseSchema(
                id=chat.id,         # noqa
                uuid=chat.uuid,     # noqa
                title=chat.title,   # noqa
                messages=[
                    ChatMessageSchema(id=msg.id, role=msg.role, content=msg.content)
                    for msg in chat.messages
                ]
            )
        except Exception as e:
            self._db.rollback()
            raise e
        finally:
            self._db.close()

    def create_message(self, chat_id: int, role: str, content: str) -> dict:
        try:
            message = Message(chat_id=chat_id, role=role, content=content)
            self._db.add(message)
            self._db.commit()
            self._db.refresh(message)
            return {
                "id": message.id,
                "chat_id": message.chat_id,
                "role": message.role,
                "content": message.content
            }
        except Exception as e:
            self._db.rollback()
            raise e
        finally:
            self._db.close()

    async def acreate_chat(self, uuid: str, title: str) -> dict:
        return await to_thread(self.create_chat, uuid, title)

    async def aget_chat(self, uuid: str) -> ChatResponseSchema | None:
        return await to_thread(self.get_chat, uuid)

    async def acreate_message(self, chat_id: int, role: str, content: str) -> dict:
        return await to_thread(self.create_message, chat_id, role, content)