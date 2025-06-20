from passlib.context import CryptContext
from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base

# Роли пользователей
class UserRole(Base):
    __tablename__ = "user_role"
    user_role_id = Column(Integer, primary_key=True, index=True)
    user_role_name = Column(String(100), unique=True, nullable=False)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(100), nullable=False)
    user_email = Column(String(100), unique=True, nullable=False)
    user_phone = Column(String(12), unique=True)
    user_hash_password = Column(String(255), nullable=False)  # Здесь храним хэшированный пароль
    user_role_id = Column(Integer, ForeignKey("user_role.user_role_id"))
    user_created_date = Column(Date)

    role = relationship("UserRole")

    # Метод для хеширования пароля
    def set_password(self, password: str):
        self.user_hash_password = pwd_context.hash(password)

    # Метод для проверки пароля
    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.user_hash_password)


# Рестораны
class Restaurant(Base):
    __tablename__ = "restaurant"
    restaurant_id = Column(Integer, primary_key=True, index=True)
    restaurant_name = Column(String(120), nullable=False, unique=True)
    restaurant_address = Column(String(100), nullable=False)
    restaurant_phone = Column(String(12), unique=True)
    restaurant_created_date = Column(Date)

# Этажи / Залы
class Floor(Base):
    __tablename__ = "floor"
    floor_id = Column(Integer, primary_key=True, index=True)
    floor_name = Column(String(100), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurant.restaurant_id"))
    floor_created_date = Column(Date)

    restaurant = relationship("Restaurant")

# Столы
class Table(Base):
    __tablename__ = "table"
    table_id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey("floor.floor_id"))
    table_number = Column(String(5), nullable=False)
    table_capacity = Column(Integer, nullable=False)
    table_created_date = Column(Date)

    floor = relationship("Floor")

# Статусы бронирования
class BookingStatus(Base):
    __tablename__ = "booking_status"
    booking_status_id = Column(Integer, primary_key=True, index=True)
    booking_status_name = Column(String(100), unique=True, nullable=False)

# Бронирование
class Booking(Base):
    __tablename__ = "booking"
    booking_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.user_id"))
    table_id = Column(Integer, ForeignKey("table.table_id"))
    booking_date = Column(Date)
    booking_start_time = Column(Date)
    booking_end_time = Column(Date)
    booking_status_id = Column(Integer, ForeignKey("booking_status.booking_status_id"))
    booking_created_date = Column(Date)

    user = relationship("User")
    table = relationship("Table")
    status = relationship("BookingStatus")
