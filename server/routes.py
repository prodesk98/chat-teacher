from fastapi import APIRouter, Depends, HTTPException

from controllers import ChatController, AgentController
from databases import get_db
from schemas import NewChatRequestSchema, NewAgentRequestSchema

chat = APIRouter(
    prefix="/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
    dependencies=[],
)

@chat.post("/new")
async def post_new_chat(data: NewChatRequestSchema, db=Depends(get_db)):
    try:
        await ChatController(db).acreate_chat(uuid=data.uuid, title=data.title)
        return {"message": "New chat created successfully!"}
    except Exception as e:
        raise HTTPException(detail=f"{e}", status_code=500)

@chat.post("/{uuid}")
async def post_chat(data: NewAgentRequestSchema, uuid: str, db=Depends(get_db)):
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
    return await ChatController(db).aget_chat(uuid)
