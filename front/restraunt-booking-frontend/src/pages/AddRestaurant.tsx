import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { Button, Form, Input, Typography, message, Flex, Spin, InputNumber } from 'antd';

const { Title } = Typography;

interface User {
    user_role_id: number;
}

export default function AddRestaurant() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await API.get("/auth/profile");
                setUser(response.data);
            } catch (error) {
                message.error("Ошибка загрузки профиля");
                navigate("/login");
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, [navigate]);

    const onFinish = async (values: any) => {
        try {
            const payload = {
                restaurant_name: values.restaurant_name,
                restaurant_address: values.restaurant_address,
                restaurant_phone: values.restaurant_phone,
                restaurant_open_hours: values.restaurant_open_hours,
                restaurant_open_minutes: values.restaurant_open_minutes,
                restaurant_close_hours: values.restaurant_close_hours,
                restaurant_close_minutes: values.restaurant_close_minutes,
                latitude: values.latitude,
                longitude: values.longitude
            };

            await API.post("/restaurant/post", payload);
            message.success("Ресторан успешно добавлен");
        } catch {
            message.error("Ошибка при добавлении ресторана");
        }
    };

    if (loadingUser) {
        return <Spin size="large" style={{ marginTop: 100 }} />;
    }

    if (user?.user_role_id !== 2) {
        return <Title>У вас нет доступа к этой странице</Title>;
    }

    return (
        <Flex vertical align="center" justify="center" style={{ marginTop: 50 }}>
            <Title>Добавить ресторан</Title>
            <Form
                name="add-restaurant"
                onFinish={onFinish}
                layout="vertical"
                style={{ width: 400 }}
            >
                <Form.Item
                    label="Название ресторана"
                    name="restaurant_name"
                    rules={[{ required: true, message: 'Введите название ресторана' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Адрес ресторана"
                    name="restaurant_address"
                    rules={[{ required: true, message: 'Введите адрес ресторана' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Телефон ресторана"
                    name="restaurant_phone"
                    rules={[{ required: true, message: 'Введите телефон ресторана' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Часы открытия (0-23)"
                    name="restaurant_open_hours"
                    rules={[{ required: true, message: 'Введите часы открытия' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Минуты открытия (0-59)"
                    name="restaurant_open_minutes"
                    rules={[{ required: true, message: 'Введите минуты открытия' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Часы закрытия (0-23)"
                    name="restaurant_close_hours"
                    rules={[{ required: true, message: 'Введите часы закрытия' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Минуты закрытия (0-59)"
                    name="restaurant_close_minutes"
                    rules={[{ required: true, message: 'Введите минуты закрытия' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Широта"
                    name="latitude"
                    rules={[{ required: true, message: 'Введите широту' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Долгота"
                    name="longitude"
                    rules={[{ required: true, message: 'Введите долготу' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Button type="primary" htmlType="submit">Добавить</Button>
            </Form>
            <Button onClick={() => navigate("/")} type={"primary"} size={"large"}>Назад</Button>            
        </Flex>
    );
}
