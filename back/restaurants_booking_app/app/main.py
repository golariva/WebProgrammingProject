# === твой текущий main.py ===
from fastapi import FastAPI
from app.routes import admin
from app.routes import booking
from app.routes import booking_status
from app.routes import floor
from app.routes import restraunt
from app.routes import table
from app.routes import user_role
from app.routes import user
from app.routes import auth
from app.routes import admin_panel
from fastapi.middleware.cors import CORSMiddleware

from datetime import datetime
from enum import Enum
from typing import List, Optional, Union
from pydantic import BaseModel, Field

from fastapi import FastAPI, Request, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

app = FastAPI(
    title="Restraunt Booking"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8018",
        "http://localhost:8000",
        "http://devops-03.hse.perm.ru:8018"
    ],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(admin.router)
app.include_router(booking.router)
app.include_router(booking_status.router)
app.include_router(floor.router)
app.include_router(restraunt.router)
app.include_router(table.router)
app.include_router(user_role.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(admin_panel.router)

# === ниже добавляем код из seed_db.py ===

import os
import psycopg2
from alembic.config import Config
from alembic import command

def run_migrations():
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    alembic_cfg = Config(os.path.join(BASE_DIR, "alembic.ini"))
    command.upgrade(alembic_cfg, "head")

def seed_data():
    conn = psycopg2.connect(
        dbname="restraunts_booking",
        user="postgres",
        password="postgres",
        host="db",
        port=5432
    )
    cur = conn.cursor()

    sql_restaurants = """
    INSERT INTO public."Restaurant" (
        restaurant_id,
        restaurant_name,
        restaurant_address,
        restaurant_phone,
        restaurant_created_date,
        latitude,
        longitude,
        restaurant_open_hours,
        restaurant_open_minutes,
        restaurant_close_hours,
        restaurant_close_minutes
    ) VALUES
        (1, 'Вкусный уголок', 'ул. Пушкина, 10', '+79001234567', NOW(), 59.9343, 30.3351, 9, 0, 22, 0),
        (2, 'Солнечный берег', 'пр. Ленина, 50', '+79002345678', NOW(), 55.7558, 37.6173, 10, 30, 23, 0),
        (3, 'Лесная сказка', 'ул. Гагарина, 7', '+79003456789', NOW(), 56.8389, 60.6057, 8, 0, 21, 30)
    ON CONFLICT (restaurant_id) DO UPDATE SET
        restaurant_name = EXCLUDED.restaurant_name,
        restaurant_address = EXCLUDED.restaurant_address,
        restaurant_phone = EXCLUDED.restaurant_phone,
        restaurant_created_date = EXCLUDED.restaurant_created_date,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        restaurant_open_hours = EXCLUDED.restaurant_open_hours,
        restaurant_open_minutes = EXCLUDED.restaurant_open_minutes,
        restaurant_close_hours = EXCLUDED.restaurant_close_hours,
        restaurant_close_minutes = EXCLUDED.restaurant_close_minutes;
    """

    sql_roles = """
    INSERT INTO public."User_Role" (user_role_id, user_role_name)
    VALUES
      (1, 'посетитель'),
      (2, 'администратор'),
      (3, 'повар')
    ON CONFLICT (user_role_id) DO UPDATE SET
      user_role_name = EXCLUDED.user_role_name;
    """

    cur.execute(sql_restaurants)
    cur.execute(sql_roles)

    conn.commit()
    cur.close()
    conn.close()
    print("Данные успешно добавлены или обновлены")

@app.on_event("startup")
async def startup_event():
    try:
        print("Запуск миграций Alembic...")
        run_migrations()
        print("Миграции выполнены")
        print("Засев начальных данных...")
        seed_data()
        print("Данные успешно засеяны")
    except Exception as e:
        print("Ошибка при миграции/засеве:", e)

