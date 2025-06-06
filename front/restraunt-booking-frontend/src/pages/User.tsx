import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import LoginForm from "../components/LoginForm.tsx";
import { Flex, Button, Typography, Input } from "antd";

const { Title, Text } = Typography;

interface User {
    user_id: number;
    user_name: string;
    user_email: string;
    user_phone: string;
    user_created_date: string;
    user_role_id: number;
}

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<Partial<User>>({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await API.get("/auth/profile");
                setUser(response.data);
            } catch {
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await API.post("/auth/logout");
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login", { replace: true });
            window.location.reload();
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedUser({
            user_name: user?.user_name,
            user_email: user?.user_email,
            user_phone: user?.user_phone,
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser({});
    };

    const handleSave = async () => {
        try {
            await API.put("/user/update", editedUser);
            setUser((prev) => ({ ...prev, ...editedUser } as User));
            setIsEditing(false);
        } catch (err) {
            console.error("Ошибка при обновлении:", err);
        }
    };

    if (!user) {
        return <LoginForm />;
    }

    return (
        <Flex vertical>
            <Title>Личный кабинет</Title>

            <Flex vertical>
                <Button onClick={() => navigate("/")} type="primary" size="large">
                    Назад на главную
                </Button>

                <Button onClick={handleLogout} type="primary" size="large">
                    Выйти
                </Button>
            </Flex>

            <Flex vertical>
                {isEditing ? (
                    <>
                        <Text strong>Имя</Text>
                        <Input
                            value={editedUser.user_name}
                            onChange={(e) => setEditedUser({ ...editedUser, user_name: e.target.value })}
                        />

                        <Text strong>Email</Text>
                        <Input
                            value={editedUser.user_email}
                            onChange={(e) => setEditedUser({ ...editedUser, user_email: e.target.value })}
                        />

                        <Text strong>Телефон</Text>
                        <Input
                            value={editedUser.user_phone}
                            onChange={(e) => setEditedUser({ ...editedUser, user_phone: e.target.value })}
                        />

                        <Flex gap="small">
                            <Button onClick={handleSave} type="primary">
                                Сохранить изменения
                            </Button>
                            <Button onClick={handleCancel} type="default">
                                Отменить изменения
                            </Button>
                        </Flex>
                    </>
                ) : (
                    <>
                        <Title level={4}>{user.user_name}</Title>
                        <Title level={5}>Email: {user.user_email}</Title>
                        <Title level={5}>Телефон: {user.user_phone}</Title>
                        <Title level={5}>
                            Дата регистрации: {new Date(user.user_created_date).toLocaleDateString()}
                        </Title>
                        <Button onClick={handleEditClick} type="primary">
                            Изменить данные
                        </Button>
                    </>
                )}
            </Flex>
        </Flex>
    );
}
