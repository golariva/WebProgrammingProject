import { useEffect, useState } from "react";
import API from "../api";
import { Button, Flex, Select, Typography } from 'antd';
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
    user_id: number;
    booking_status_id: number;
}

const statusLabels = [
    { value: '1', label: "Оплачено" },
    { value: '2', label: "Не оплачено" },
    { value: '3', label: "Ожидает подтверждения" }
];

export default function AdminPanel() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await API.get("/admin/booking/list");
                setBookings(response.data);
            } catch {
                setError("Ошибка загрузки бронирований");
            }
        };

        fetchBookings();
    }, []);

    const updateStatus = async (booking_id: number, newStatus: number) => {
        try {
            await API.put(`/admin/booking/update-status/${booking_id}`, { booking_status_id: newStatus });
            setBookings((prev) => prev.map((b) => (b.booking_id === booking_id ? { ...b, booking_status_id: newStatus } : b)));
        } catch {
            setError("Ошибка обновления статуса");
        }
    };

    const deleteBooking = async (booking_id: number) => {
        try {
            await API.delete(`/admin/booking/delete/${booking_id}`);
            setBookings((prev) => prev.filter((b) => b.booking_id !== booking_id));
        } catch {
            setError("Ошибка удаления бронирования");
        }
    };

    return (
        <Flex vertical>
            <Title>Панель администратора</Title>
            {error && <p className="text-red-500">{error}</p>}
            <table className="w-full border-collapse border border-gray-300" style={{ backgroundColor: 'white', padding: '100px', borderRadius: '10px' }}>
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
                        <td className="border p-2" style={{ width: "150px", paddingLeft: "0px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <Select
                                options={statusLabels}
                                style={{ width: 200, minWidth: 200 }}
                                defaultValue={booking.booking_status_id.toString()}
                                onChange={(e) => { updateStatus(booking.booking_id, e as unknown as number) }}
                            />
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
