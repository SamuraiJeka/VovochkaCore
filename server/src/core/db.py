from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from core.settings import settings


engine = create_async_engine(url=settings.db_url, echo=True)
session = async_sessionmaker(engine)
