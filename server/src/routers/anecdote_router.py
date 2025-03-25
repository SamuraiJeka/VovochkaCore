from fastapi import APIRouter

from core.db import sessionmaker
from service.anecdote_service import AnecdoteService as service
from schemas.anecdote_schema import (
    AnecdoteSchema,
    AnecdotePostSchema,
    AnecdoteUpdateSchema,
)


router = APIRouter(prefix="/anecdote", tags=["anecdote"])


@router.get("/")
async def get_all_anecdotes() -> AnecdoteSchema: ...


@router.get("/{anecdote_id}")
async def get_anecdote_by_id(anecdote_id: int) -> AnecdoteSchema:
    async with sessionmaker() as session:
        return await service(session).get_by_id(anecdote_id=anecdote_id)


@router.post("/")
async def post_anecdote(anecdote_dto: AnecdotePostSchema) -> AnecdoteSchema:
    async with sessionmaker() as session:
        return await service(session).create(anecdote_dto)


@router.patch("/{anecdote_id}")
async def update_anecdote(
    anecdote_id: int, anecdote_dto: AnecdoteUpdateSchema
) -> AnecdoteSchema:
    async with sessionmaker() as session:
        return await service(session).update(anecdote_id, anecdote_dto)


@router.delete("/{anecdote_id}")
async def delete_ancedote(anecdote_id: int) -> dict:
    async with sessionmaker() as session:
        result = await service(session).delete(anecdote_id)
        print(type({"Message": result}))
        return {"Message": result}
