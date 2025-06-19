import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import {Button, Flex} from "antd";
import { Typography } from 'antd';


const { Title } = Typography;

interface User {
    user_role_id: number;
}

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await API.get("/auth/profile");
                setUser(response.data);
            } catch (error) {
                console.error("Ошибка загрузки профиля:", error);
            }
        };

        fetchUser();
    }, []);
    return (
        <Flex className="p-6 text-center" vertical={true}>
            <Title>Добро пожаловать в сервис бронирования!</Title>
            <Title level={4} >
                Выберите ресторан, этаж и столик для комфортного отдыха.
            </Title>
            <Flex className="flex flex-col gap-4 max-w-md mx-auto" vertical={true}>
                <Button
                    onClick={() => navigate("/profile")}
                    type={"primary"}
                    size={"large"}
                >
                    Личный кабинет
                </Button>
                {user?.user_role_id === 1 && (
                    <>
                        <Button
                            onClick={() => navigate("/restaurants")}
                            type={"primary"}
                            size={"large"}
                        >
                            Список ресторанов
                        </Button>
                        <Button
                            onClick={() => navigate("/user_bookings")}
                            type={"primary"}
                            size={"large"}
                        >
                            Мои бронирования
                        </Button>
                        <Button
                            onClick={() => navigate("/about")}
                            type={"primary"}
                            size={"large"}
                        >
                            О нас
                        </Button>
                    </>
                )}
                {user?.user_role_id === 2 && (
                    <>
                        <Button onClick={() => navigate("/adminpanel")} type="primary" size="large">
                            Панель администратора
                        </Button>
                        <Button onClick={() => navigate("/add-restaurant")} type="primary" size="large">
                            Добавить ресторан
                        </Button>
                    </>
                )}
            </Flex>
        </Flex>

    );
}
