from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, update, delete, exists

from models.anecdote import Anecdote
from schemas.anecdote_schema import AnecdotePostSchema, AnecdoteUpdateSchema
from exceptions.anecdote_exceptions import AnecdoteNotFoundError, AnecdoteAlreadyExist


class AnecdoteRepository:
    def __init__(self, session: AsyncSession):
        self.__session = session

    async def get_by_id(self, anecdote_id: int) -> Anecdote | None:
        query = select(Anecdote).where(Anecdote.id == anecdote_id)
        result = await self.__session.execute(query)
        anecdote = result.scalar_one_or_none()
        if anecdote is None:
            raise AnecdoteNotFoundError
        await self.__session.refresh(anecdote)
        return anecdote

    async def create(self, anecdote_dto: AnecdotePostSchema) -> Anecdote | None:
        if await self.is_exist(anecdote_name=anecdote_dto.name):
            raise AnecdoteAlreadyExist
        query = (
            insert(Anecdote)
            .values(
                name=anecdote_dto.name,
                content=anecdote_dto.content,
                tag=anecdote_dto.tag,
            ).returning(Anecdote)
        )
        result = await self.__session.execute(query)
        await self.__session.commit()
        new_anecdote = result.scalars().one_or_none()
        await self.__session.refresh(new_anecdote)
        return new_anecdote

    async def update(
        self, anecdote_id: int, anecdote_dto: AnecdoteUpdateSchema
    ) -> Anecdote | None:
        update_anecdote = anecdote_dto.model_dump(exclude_unset=True)
        query = (
            update(Anecdote)
            .where(Anecdote.id == anecdote_id)
            .values(**update_anecdote)
            .returning(Anecdote)
        )
        result = await self.__session.execute(query)
        await self.__session.commit()
        anecdote = result.scalar_one_or_none()
        if anecdote is None:
            raise AnecdoteNotFoundError
        await self.__session.refresh(anecdote)
        return anecdote

    async def delete(self, anecdote_id: int) -> bool:
        if not await self.is_exist(anecdote_id=anecdote_id):
            raise AnecdoteNotFoundError
        query = delete(Anecdote).where(Anecdote.id == anecdote_id)
        result = await self.__session.execute(query)
        await self.__session.commit()
        return bool(result)
    
    async def is_exist(self, anecdote_id: str = None, anecdote_name: int = None) -> bool | None:
        if anecdote_id is not None:
            query = select(exists().where(Anecdote.id == anecdote_id))
        elif anecdote_name is not None:
            query = select(exists().where(Anecdote.name == anecdote_name))
        result = await self.__session.execute(query)
        return result.scalar()
