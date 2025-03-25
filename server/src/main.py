from fastapi import FastAPI

import routers.anecdote_router as anecdote


app = FastAPI()

app.include_router(anecdote.router)
