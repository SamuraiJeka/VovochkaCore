from typing import Optional
from pydantic import BaseModel, Field


class AnecdotePostSchema(BaseModel):
    name: str = Field(..., min_length=3, max_length=64)
    content: str
    tag: str


class AnecdoteSchema(AnecdotePostSchema):
    id: int


class AnecdoteUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=64)
    content: Optional[str] = None
    tag: Optional[str] = None
