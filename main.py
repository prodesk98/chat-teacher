import os

from fastapi import FastAPI, APIRouter, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

_path = os.path.dirname(os.path.abspath(__file__))

app.mount("/public", StaticFiles(directory="%s/public/src" % _path), name="static")
templates = Jinja2Templates(directory="%s/public/templates" % _path)


chat = APIRouter(
    prefix="/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
    dependencies=[],
)

@app.get("/")
def get_chat(request: Request):
    context = {}
    return templates.TemplateResponse(request=request, name="index.html", context=context)

@app.post("/")
def post_chat():
    return {"message": "Chat created successfully!"}

app.include_router(chat)