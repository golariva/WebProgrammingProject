import { useEffect, useState } from "react";
import API from "../api";
import { Button, Flex, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const { Title } = Typography;

interface Booking {
    booking_id: number;
    booking_date: string;
    booking_start_hours: number;
    booking_end_hours: number;
    booking_start_minutes: number;
    booking_end_minutes: number;
    table_name: string;
    restaurant_name: string;
    booking_status_id: number;
}

const statusLabels = [
    { value: "1", label: "Оплачено" },
    { value: "2", label: "Не оплачено" },
    { value: "3", label: "Ожидает подтверждения" }
];

export default function UserBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await API.get("/user/bookings");
                setBookings(response.data);
            } catch {
                setError("Ошибка загрузки бронирований");
            }
        };

        fetchBookings();
    }, []);

    const deleteBooking = async (booking_id: number) => {
        try {
            await API.delete(`/booking/delete/${booking_id}`);
            setBookings((prev) => prev.filter((b) => b.booking_id !== booking_id));
        } catch {
            setError("Ошибка удаления бронирования");
        }
    };

    return (
        <Flex vertical>
            <Title>Мои бронирования</Title>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table className="w-full border-collapse border border-gray-300"
                   style={{ backgroundColor: "white", padding: "100px", borderRadius: "10px" }}>
                <thead>
                <tr className="bg-gray-100" style={{ background: "rgb(46, 209, 149)" }}>
                    <th className="border p-2" style={{ width: "250px" }}>Дата</th>
                    <th className="border p-2" style={{ width: "100px" }}>Начало</th>
                    <th className="border p-2" style={{ width: "100px" }}>Конец</th>
                    <th className="border p-2" style={{ width: "200px" }}>Стол (Ресторан)</th>
                    <th className="border p-2" style={{ width: "250px" }}>Статус</th>
                    <th className="border p-2" style={{ width: "250px" }}>Действие</th>
                </tr>
                </thead>
                <tbody>
                {bookings.map((booking) => (
                    <tr key={booking.booking_id} className="border">
                        <td className="border p-2" style={{ width: "150px", paddingLeft: "100px" }}>{booking.booking_date}</td>
                        <td className="border p-2" style={{ width: "100px", paddingLeft: "100px" }}>{booking.booking_start_hours}:{booking.booking_start_minutes}</td>
                        <td className="border p-2" style={{ width: "100px", paddingLeft: "100px" }}>{booking.booking_end_hours}:{booking.booking_end_minutes}</td>
                        <td className="border p-2" style={{ width: "200px", paddingLeft: "80px" }}>
                            {booking.table_name} ({booking.restaurant_name})
                        </td>
                        <td className="border p-2" style={{ width: "100px", paddingLeft: "80px" }}>
                            {statusLabels[booking.booking_status_id - 1].label}
                        </td>
                        <td className="border p-2"
                            style={{ width: "150px", paddingLeft: "0px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <Button
                                onClick={() => deleteBooking(booking.booking_id)}
                                type={"primary"}
                                size={"small"}
                                style={{ minWidth: "30px", height: "30px", width: "30px", marginBottom: "20px" }}
                            >
                                <DeleteOutlined />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Button onClick={() => navigate("/")} type={"primary"} size={"large"}>Назад</Button>
        </Flex>
    );
}
