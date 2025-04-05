from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqladmin import Admin

from core.db import engine, settings
from utils.admin.auth import AdminAuth
from utils.admin.views import AdminView, AnecdoteView
import routers.anecdote_router as anecdote


app = FastAPI()

authentication_backend = AdminAuth(secret_key=settings.SEKRET_KEY)
admin = Admin(
    app=app,
    engine=engine,
    authentication_backend=authentication_backend
)
admin.add_view(AdminView)
admin.add_view(AnecdoteView)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"]
)

app.include_router(anecdote.router)
