from asyncio import to_thread
from typing import IO

from elevenlabs import VoiceSettings
from sqlalchemy.orm import Session

from config import env
from databases.sessions import Chat, Message
from elevenlabs.client import ElevenLabs
from schemas import ChatResponseSchema, ChatMessageSchema, ChatCreateSchema, MessageCreateSchema


class ChatController:
    def __init__(self, db: Session):
        self._db = db

    def create_chat(self, uuid: str, title: str) -> ChatCreateSchema:
        try:
            chat = Chat(uuid=uuid, title=title)
            self._db.add(chat)
            self._db.commit()
            self._db.refresh(chat)
            return ChatCreateSchema(
                id=chat.id,
                uuid=chat.uuid,
                title=chat.title
            )
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

    def create_message(self, chat_id: int, role: str, content: str) -> MessageCreateSchema:
        try:
            message = Message(chat_id=chat_id, role=role, content=content)
            self._db.add(message)
            self._db.commit()
            self._db.refresh(message)
            return MessageCreateSchema(
                id=message.id,
                chat_id=message.chat_id,
                role=message.role,
                content=message.content
            )
        except Exception as e:
            self._db.rollback()
            raise e
        finally:
            self._db.close()

    @staticmethod
    def speak(content: str) -> IO[bytes] | None:
        if env.ELEVEN_LABS_API_KEY is None or env.ELEVEN_LABS_VOICE_ID is None:
            return None
        elevenlabs = ElevenLabs(api_key=env.ELEVEN_LABS_API_KEY)
        try:
            audio = elevenlabs.text_to_speech.stream(
                voice_id=env.ELEVEN_LABS_VOICE_ID,
                output_format="mp3_22050_32",
                text=content,
                model_id=env.ELEVEN_LABS_MODEL_ID,
                voice_settings=VoiceSettings(
                    stability=0.5,
                    similarity_boost=0.75,
                    style=0.0,
                    use_speaker_boost=True,
                    speed=1.0,
                )
            )
            return audio
        except Exception as e:
            raise RuntimeError(f"Failed to generate speech: {str(e)}")

    async def acreate_chat(self, uuid: str, title: str) -> ChatCreateSchema:
        return await to_thread(self.create_chat, uuid, title)

    async def aget_chat(self, uuid: str) -> ChatResponseSchema | None:
        return await to_thread(self.get_chat, uuid)

    async def acreate_message(self, chat_id: int, role: str, content: str) -> MessageCreateSchema:
        return await to_thread(self.create_message, chat_id, role, content)

    async def aspeak(self, content: str) -> IO[bytes] | None:
        return await to_thread(self.speak, content)