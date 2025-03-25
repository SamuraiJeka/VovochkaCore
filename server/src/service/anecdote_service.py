from sqlalchemy.ext.asyncio import AsyncSession

from repositories.anecdote_repository import AnecdoteRepository
from schemas.anecdote_schema import (
    AnecdoteSchema,
    AnecdotePostSchema,
    AnecdoteUpdateSchema,
)


class AnecdoteService:
    def __init__(self, session: AsyncSession):
        self.reposiotory = AnecdoteRepository(session)

    async def create(self, anecdote_dto: AnecdotePostSchema) -> AnecdoteSchema:
        new_anecdote = await self.reposiotory.create(anecdote_dto)
        return AnecdoteSchema.model_validate(new_anecdote, from_attributes=True)

    async def get_by_id(self, anecdote_id: int) -> AnecdoteSchema:
        anecdote = await self.reposiotory.get_by_id(anecdote_id)
        return AnecdoteSchema.model_validate(anecdote, from_attributes=True)

    async def update(
        self, anecdote_id: int, anecdote_dto: AnecdoteUpdateSchema
    ) -> AnecdoteSchema:
        anecdote = await self.reposiotory.update(anecdote_id, anecdote_dto)
        return AnecdoteSchema.model_validate(anecdote, from_attributes=True)

    async def delete(self, anecdote_id: int) -> bool:
        result = await self.reposiotory.delete(anecdote_id)
        return result
