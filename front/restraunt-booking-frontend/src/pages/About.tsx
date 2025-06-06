import { useNavigate } from "react-router-dom";
import {Button, Flex, Typography} from 'antd';

const { Title, Text} = Typography;
export default function About() {
    const navigate = useNavigate();

    return (
        <Flex vertical>
            <Title>О нашем сервисе</Title>
            <Text style={{fontSize: 18}}>
                Добро пожаловать в сервис бронирования столиков.
            </Text>
            <Text style={{fontSize: 18}}>
                Комфортный отдых начинается с комфортного планирования — бронируйте столики в ресторанах на нашем сайте.
            </Text>

            <Title level={3}>Возможности веб-приложения</Title>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Выбор ресторана из списка и нахождение их на интерактивной карте</li>
                <li>Бронирование столика на выбранном этаже любого ресторана</li>
                <li>Отслеживание своих броней в личном кабинете</li>
            </ul>

            <Button
                onClick={() => navigate("/")}
                type={"primary"}
                size={"large"}
            >
                Вернуться на главную
            </Button>
        </Flex>
    );
}
