from sqlalchemy import String, Text, Enum
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base
from enums.tags import Tags


class Anecdote(Base):
    __tablename__ = "anecdotes"

    name: Mapped[str] = mapped_column(String(64), unique=False, nullable=False)
    content: Mapped[str] = mapped_column(Text(), unique=False, nullable=False)
    tag: Mapped[Tags] = mapped_column(Enum(Tags), unique=False, nullable=True)
