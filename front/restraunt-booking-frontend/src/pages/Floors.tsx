import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import {Button, Flex, Typography} from "antd";

const { Title } = Typography;
interface Floor {
    floor_id: number;
    floor_name: string;
}

export default function Floors() {
    const { restaurant_id } = useParams();
    const [floors, setFloors] = useState<Floor[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        API.get(`/floor/restaurant/${restaurant_id}`)
            .then((response) => {
                setFloors(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке этажей:", error);
            });
    }, [restaurant_id]);

    return (
        <Flex vertical>
            <Title level={2}>Выберите этаж</Title>
            <Button
                onClick={() => navigate("/restaurants")}
                type={"primary"}
                size={"large"}
            >
                Назад к ресторанам
            </Button>
            <Flex vertical>
                {floors.map((floor) => (
                    <div key={floor.floor_id} className="border p-4 rounded-lg shadow-lg">
                        <Title level={3}>Этаж {floor.floor_name}</Title>
                        <Button
                            onClick={() => navigate(`/restaurant/${restaurant_id}/floor/${floor.floor_id}/booking`)}
                            type={"primary"}
                            size={"large"}
                        >
                            Забронировать
                        </Button>
                    </div>
                ))}
            </Flex>
        </Flex>
    );
}
