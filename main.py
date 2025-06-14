import os

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from server import chat

app = FastAPI(
    title="Chat Application",
    description="A simple chat application using FastAPI and WebSockets.",
    version="1.0.0",
)

_path = os.path.dirname(os.path.abspath(__file__))

app.mount("/public", StaticFiles(directory="%s/public/src" % _path), name="static")
templates = Jinja2Templates(directory="%s/public/templates" % _path)

@app.get("/")
def root(request: Request):
    return templates.TemplateResponse(request=request, name="index.html", context={})

app.include_router(chat)