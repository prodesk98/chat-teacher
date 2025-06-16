from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from controllers import ChatController, AgentController
from databases import get_db
from schemas import NewChatRequestSchema, NewAgentRequestSchema, SpeakRequestSchema

chat = APIRouter(
    prefix="/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
    dependencies=[],
)

@chat.post("/new")
async def post_new_chat(data: NewChatRequestSchema, db=Depends(get_db)):
    """
    Create a new chat with the given UUID and title.
    :param data:
    :param db:
    :return:
    """
    try:
        await ChatController(db).acreate_chat(uuid=data.uuid, title=data.title)
        return {"message": "New chat created successfully!"}
    except Exception as e:
        raise HTTPException(detail=f"{e}", status_code=500)


@chat.post("/speak", response_class=StreamingResponse)
async def post_speak(data: SpeakRequestSchema, db=Depends(get_db)):
    """
    Generate a spoken response for the given content using ElevenLabs.
    :param data:
    :param db:
    :return:
    """
    try:
        stream = await ChatController(db).aspeak(data.content)
        return StreamingResponse(stream, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(detail=f"{e}", status_code=500)


@chat.post("/{uuid}")
async def post_chat(data: NewAgentRequestSchema, uuid: str, db=Depends(get_db)):
    """
    Create a new message in the chat with the given UUID and role/content.
    :param data:
    :param uuid:
    :param db:
    :return:
    """
    try:
        _chat = await ChatController(db).aget_chat(uuid)
        if not _chat:
            raise HTTPException(detail="Chat not found", status_code=404)
        await ChatController(db).acreate_message(chat_id=_chat.id, role=data.role, content=data.content)
        response = await AgentController(db).agenerate(chat_id=_chat.id)
        return {"content": response, "role": "assistant"}
    except Exception as e:
        raise HTTPException(detail=f"{e}", status_code=500)


@chat.get("/{uuid}")
async def get_chat(uuid: str, db=Depends(get_db)):
    """
    Retrieve the chat with the given UUID.
    :param uuid:
    :param db:
    :return:
    """
    return await ChatController(db).aget_chat(uuid)
