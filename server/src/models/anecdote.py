from sqlalchemy import BigInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base
from enums.tags import Tags


class Anecdote(Base):
    __tablename__ = "anecdotes"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(64), unique=False, nullable=False)
    content: Mapped[str] = mapped_column(Text(), unique=False, nullable=False)
    tag: Mapped[Tags] = mapped_column(nullable=True, unique=False)
