import os
from typing import AsyncGenerator
from fastapi import Depends
from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

db_host = "localhost"Add commentMore actions
db_port = 5432
db_user = "postgres"
db_pass = "postgres"
db_name = "restraunts_booking"

database_url = f"postgresql+asyncpg://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"

database_url = os.getenv("DATABASE_URL")

engine = create_async_engine(database_url)

async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session
