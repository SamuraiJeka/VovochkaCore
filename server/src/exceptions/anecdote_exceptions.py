from fastapi import status

class AnecdoteNotFoundError(Exception):
    def __init__(self):
        self.msg = "Анекдот не найден"
        self.status = status.HTTP_404_NOT_FOUND


class AnecdoteAlreadyExist(Exception):
    def __init__(self):
        self.msg = "Днекдот с таким именем уже существует"
        self.status = status.HTTP_400_BAD_REQUEST
