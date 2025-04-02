from sqlalchemy.ext.asyncio import AsyncSession

from repositories.anecdote_repository import AnecdoteRepository
from schemas.anecdote_schema import (
    AnecdoteSchema,
    AnecdotePostSchema,
    AnecdoteUpdateSchema,
)


class AnecdoteService:
    def __init__(self, session: AsyncSession):
        self.__reposiotory = AnecdoteRepository(session)

    async def create(self, anecdote_dto: AnecdotePostSchema) -> AnecdoteSchema:
        anecdote = await self.__reposiotory.create(anecdote_dto)
        return AnecdoteSchema.model_validate(anecdote, from_attributes=True)

    async def get_by_id(self, anecdote_id: int) -> AnecdoteSchema:
        anecdote = await self.__reposiotory.get_by_id(anecdote_id)
        return AnecdoteSchema.model_validate(anecdote, from_attributes=True)
    
    async def get_page(self, offset: int, limit: int, search: str | None = None) -> list[AnecdoteSchema]:
        anecdote_page = await self.__reposiotory.get_page(offset, limit, search)
        return [AnecdoteSchema.model_validate(anecdote, from_attributes=True) for anecdote in anecdote_page]
    
    async def get_random_anecdote(self) -> AnecdoteSchema:
        anecdote = await self.__reposiotory.get_random_anecdote()
        return AnecdoteSchema.model_validate(anecdote, from_attributes=True)

    async def update(
        self, anecdote_id: int, anecdote_dto: AnecdoteUpdateSchema
    ) -> AnecdoteSchema:
        anecdote = await self.__reposiotory.update(anecdote_id, anecdote_dto)
        return AnecdoteSchema.model_validate(anecdote, from_attributes=True)

    async def delete(self, anecdote_id: int) -> None:
        result = await self.__reposiotory.delete(anecdote_id)
        return result
