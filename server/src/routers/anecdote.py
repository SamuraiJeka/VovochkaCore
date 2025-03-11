from fastapi import APIRouter


router = APIRouter(prefix="/anecdote", tags=["anecdote"])


@router.get("/")
async def get_all_anecdotes():
    return "all"


@router.post("/")
async def post_anecdote():
    return "post"
