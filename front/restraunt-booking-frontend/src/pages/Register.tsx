import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import styles from "../styles/RegisterForm.module.css";
import {Button, Typography} from 'antd';

const { Title, Text} = Typography;

const Register = () => {
    const [formData, setFormData] = useState({
        user_name: "",
        user_email: "",
        user_phone: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Пароли не совпадают!");
            return;
        }

        try {
            await API.post("/auth/register", {
                user_name: formData.user_name,
                user_email: formData.user_email,
                user_phone: formData.user_phone,
                user_hash_password: formData.password,
                user_role_id: 1,
                user_created_date: new Date().toISOString().split("T")[0]
            });

            alert("Регистрация успешна!");
            navigate("/login");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Ошибка регистрации");
            }
        }
    };

    return (
        <div className={styles.form}>
            <Title level={2}>Регистрация</Title>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="user_name" placeholder="Имя" onChange={handleChange} required />
                <input type="email" name="user_email" placeholder="Email" onChange={handleChange} required />
                <input type="tel" name="user_phone" placeholder="Телефон" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder="Повторите пароль" onChange={handleChange} required />
                <Button
                    type={"primary"}
                    size={"large"}
                    htmlType={"submit"}
                >Зарегистрироваться</Button>
            </form>
            <Text>
                Есть аккаунт?
            </Text>

            <Button onClick={() => navigate("/login")} >Авторизироваться</Button>

        </div>
    );
};

export default Register;
