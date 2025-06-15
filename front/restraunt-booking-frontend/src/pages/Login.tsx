import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../api";
import LoginForm from "../components/LoginForm";
import {Button, Flex, Typography} from "antd";


const { Title } = Typography;

interface User {
    user_id: number;
    user_name: string;
    user_email: string;
    user_phone: string;
    user_created_date: string;
}

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getUserProfile().then((data) => {
            if (data) {
                setUser(data);
            } else {
                navigate("/login");
            }
        });
    }, [navigate]);

    if (!user) {
        return <LoginForm />;
    }

    return (
        <Flex vertical={true}>
            <Title >Личный кабинет</Title>
            <Button
                onClick={() => navigate("/")}
                type={"primary"}
                size={"large"}
            >
                Назад на главную
            </Button>
            <Flex >
                <Title level={2}>{user.user_name}</Title>
                <p className="text-gray-600">Email: {user.user_email}</p>
                <p className="text-gray-800">Телефон: {user.user_phone}</p>
                <p className="text-gray-500 text-sm">
                    Дата регистрации: {new Date(user.user_created_date).toLocaleDateString()}
                </p>
            </Flex>
        </Flex>
    );
}

