import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngBounds, LatLngExpression } from "leaflet";
import API from "../api";
import "leaflet/dist/leaflet.css";
import {Button, Flex, Typography} from 'antd';

const { Title, Text} = Typography;

interface Restaurant {
    restaurant_id: number;
    restaurant_name: string;
    restaurant_address: string;
    restaurant_phone: string;
    restaurant_created_date: string;
    restaurant_open_hours: number;
    restaurant_open_minutes: number;
    restaurant_close_hours: number;
    restaurant_close_minutes: number;
    latitude: number;
    longitude: number;
}

function MapAutoFit({ restaurants }: { restaurants: Restaurant[] }) {
    const map = useMap();

    useEffect(() => {
        if (restaurants.length > 0) {
            const bounds = new LatLngBounds(
                restaurants.map(({ latitude, longitude }) => [latitude, longitude] as LatLngExpression)
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [restaurants, map]);

    useEffect(() => {
        setTimeout(() => {
            const flag = document.querySelector(
                ".leaflet-control-container .leaflet-bottom.leaflet-right > div > a > svg"
            );
            if (flag && flag.parentElement) {
                flag.parentElement.remove();
            }
        }, 100);
    }, []);

    return null;
}

export default function Restaurants() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const navigate = useNavigate();
    const mapRef = useRef<never>(null);

    useEffect(() => {
        API.get("/restaurant/get")
            .then((response) => {
                setRestaurants(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке ресторанов:", error);
            });
    }, []);

    return (
        <Flex vertical>
            <Title className="text-3xl font-bold mb-4">Список ресторанов</Title>
            <Button
                onClick={() => navigate("/")}
                type={"primary"}
                size={"large"}
            >
                Назад на главную
            </Button>

            <Flex vertical>
                <Flex vertical>
                    {restaurants.map((restaurant) => (
                        <Flex vertical
                            key={restaurant.restaurant_id}
                            className="border p-4 rounded-lg shadow-lg"
                        >
                            <Title level={3}>{restaurant.restaurant_name}</Title>
                            <Text className="text-gray-600">{restaurant.restaurant_address}</Text>
                            <Text className="text-gray-800 font-medium">{restaurant.restaurant_phone}</Text>
                            <Text className="text-gray-500 text-sm">
                                Часы работы: {restaurant.restaurant_open_hours}:{restaurant.restaurant_open_minutes}
                                - {restaurant.restaurant_close_hours}:{restaurant.restaurant_close_minutes}
                            </Text>
                            <Text className="text-gray-500 text-sm">
                                Дата добавления: {new Date(restaurant.restaurant_created_date).toLocaleDateString()}
                            </Text>
                            <Button
                                onClick={() => navigate(`/restaurant/${restaurant.restaurant_id}/floors`)}
                                type={"dashed"}
                                size={"large"}
                            >
                                Выбрать этаж
                            </Button>
                        </Flex>
                    ))}
                </Flex>

                <Flex vertical  >
                    <MapContainer
                        center={[55.7558, 37.6173]}
                        zoom={10}
                        style={{ height: "400px", width: "100%" }}
                        ref={mapRef}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapAutoFit restaurants={restaurants} />
                        {restaurants.map((restaurant) =>
                            restaurant.latitude && restaurant.longitude ? (
                                <Marker
                                    key={restaurant.restaurant_id}
                                    position={[restaurant.latitude, restaurant.longitude] as LatLngExpression}
                                >
                                    <Popup>
                                        <strong>{restaurant.restaurant_name}</strong> <br />
                                            {restaurant.restaurant_address}
                                    </Popup>
                                </Marker>
                            ) : null
                        )}
                    </MapContainer>
                </Flex>
            </Flex>
        </Flex>
    );
}
