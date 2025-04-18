from fastapi import APIRouter, HTTPException

from core.db import sessionmaker
from services.anecdote_service import AnecdoteService as service
from exceptions.anecdote_exceptions import (
    AnecdoteNotFoundError,
    AnecdoteAlreadyExist,
    TagDoesNotExist,
)
from schemas.anecdote_schema import (
    AnecdoteSchema,
    AnecdotePostSchema,
    AnecdoteUpdateSchema,
)


router = APIRouter(prefix="/anecdote", tags=["anecdote"])


@router.get("/page")
async def get_page_anecdotes(
    offset: int,
    limit: int,
    search: str | None = None
) -> list[AnecdoteSchema]:
    try:
        async with sessionmaker() as session:
            return await service(session).get_page(offset, limit, search)
    except AnecdoteNotFoundError as exc:
        raise HTTPException(detail=exc.msg, status_code=exc.status)


@router.get("/category")
async def get_category(offset: int, limit: int, tag: str) -> list[AnecdoteSchema]:
    try:
        async with sessionmaker() as session:
            return await service(session).get_category(offset, limit, tag)
    except AnecdoteNotFoundError as exc:
        raise HTTPException(detail=exc.msg, status_code=exc.status)
    except TagDoesNotExist as exc:
        raise HTTPException(detail=exc.msg, status_code=exc.status)
        

@router.get("/random")
async def get_random_anecdote() -> AnecdoteSchema:
    try:
        async with sessionmaker() as session:
            return await service(session).get_random_anecdote()
    except AnecdoteNotFoundError as exc:
        raise HTTPException(detail=exc.msg, status_code=exc.status)


@router.get("/{anecdote_id}")
async def get_anecdote_by_id(anecdote_id: int) -> AnecdoteSchema:
    try:
        async with sessionmaker() as session:
            return await service(session).get_by_id(anecdote_id=anecdote_id)
    except AnecdoteNotFoundError as exc:
        raise HTTPException(detail=exc.msg, status_code=exc.status)


@router.post("/")
async def post_anecdote(anecdote_dto: AnecdotePostSchema) -> AnecdoteSchema:
    try:
        async with sessionmaker() as session:
            return await service(session).create(anecdote_dto)
    except AnecdoteAlreadyExist as exc:
        raise HTTPException(detail=exc.msg, status_code=exc.status)


@router.patch("/{anecdote_id}")
async def update_anecdote(
    anecdote_id: int, anecdote_dto: AnecdoteUpdateSchema
) -> AnecdoteSchema:
    try:
        async with sessionmaker() as session:
            return await service(session).update(anecdote_id, anecdote_dto)
    except AnecdoteNotFoundError as exc:
        raise HTTPException(detail=exc.msg, status_code=exc.status)


@router.delete("/{anecdote_id}")
async def delete_ancedote(anecdote_id: int) -> dict:
    try:
        async with sessionmaker() as session:
            result = await service(session).delete(anecdote_id)
            return {"Message": result}
    except AnecdoteNotFoundError as exc:
        raise HTTPException(detail=exc.msg, status_code=exc.status)
