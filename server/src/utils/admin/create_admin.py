import asyncio
import random
import string
from sqlalchemy.exc import IntegrityError

from core.db import sessionmaker
from models.admin import Admin


def random_password():
    characters = string.ascii_letters + string.digits

    random_password = "".join(random.choices(characters, k=8))
    return random_password


async def create_admin() -> None:
    async with sessionmaker() as session:
        password = random_password()
        admin = Admin(name="admin", password=password)
        try:
            session.add(admin)
            await session.commit()
            await session.refresh(admin)
        except IntegrityError:
            print("Админ уже создан")
            await session.rollback()
        else:
            print(f"-\nПароль: {password}\n-")


if __name__ == "__main__":
    asyncio.run(create_admin())
