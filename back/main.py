from fastapi import FastAPI
from restaurants_booking_app.app.routes import admin 
from restaurants_booking_app.app.routes import booking
from restaurants_booking_app.app.routes import booking_status
from restaurants_booking_app.app.routes import floor
from restaurants_booking_app.app.routes import restraunt
from restaurants_booking_app.app.routes import table
from restaurants_booking_app.app.routes import user_role
from restaurants_booking_app.app.routes import user
from restaurants_booking_app.app.routes import auth
from restaurants_booking_app.app.routes import admin_panel
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
    allow_origins=["http://localhost:5173"],
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


