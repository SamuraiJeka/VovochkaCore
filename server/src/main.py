from fastapi import FastAPI

import routers.anecdote as anecdote


app = FastAPI()

app.include_router(anecdote.router)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", reload=False)