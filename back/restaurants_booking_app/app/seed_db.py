import psycopg2
from alembic.config import Config
from alembic import command

def run_migrations():
    alembic_cfg = Config("alembic.ini")
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

    # Роли пользователей
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

if __name__ == "__main__":
    print("Запуск миграций Alembic...")
    run_migrations()
    print("Заполнение данных ресторанов и ролей...")
    seed_data()
