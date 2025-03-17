from fastapi import FastAPI

import routers.anecdote as anecdote


app = FastAPI()

app.include_router(anecdote.router)
