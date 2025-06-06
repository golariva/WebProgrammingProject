import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api.ts";
import {Button, Flex} from "antd";
import { Typography } from 'antd';


const { Title } = Typography;
const { Text } = Typography;

const LoginForm = () => {
    const [formData, setFormData] = useState({ login: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await API.post("/auth/login", {
                email_or_phone: formData.login,
                password: formData.password,
            });

            console.log("Успешный вход:", response.data);

            navigate("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Ошибка входа");
            }
        }
    };

    return (
        <Flex vertical>
            <Title level={2}>Вход</Title>
            <form onSubmit={handleSubmit}>
                <input type="text" name="login" placeholder="Телефон или Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Button
                    type={"primary"}
                    size={"large"}
                    htmlType={"submit"}
                >Войти</Button>
            </form>
            <Text>
                Нет аккаунта?
            </Text>

            <Button onClick={() => navigate("/register")} >Зарегистрироваться</Button>
        </Flex>
    );
};

export default LoginForm;
