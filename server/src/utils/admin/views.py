from sqladmin import ModelView

from models.anecdote import Anecdote
from models.admin import Admin


class AnecdoteView(ModelView, model=Anecdote):
    form_include_pk = True
    form_excluded_columns = [Anecdote.id]

    column_list = [Anecdote.name, Anecdote.tag]
    column_searchable_list = [Anecdote.name, Anecdote.content, Anecdote.tag]


class AdminView(ModelView, model=Admin):
    form_include_pk = True
    form_excluded_columns = [Admin.id]

    column_list = [Admin.id, Admin.name]
    column_searchable_list = [Admin.id, Admin.name]
