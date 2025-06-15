import React from "react";
import { render, screen, waitFor} from "@testing-library/react";
import UserBookings from "./UserBookings";
import API from "../api";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';

// Мокаем API-запросы
jest.mock("../api");

const mockedAPI = API as jest.Mocked<typeof API>;

const bookingsMock = [
  {
    booking_id: 1,
    booking_date: "2025-06-20",
    booking_start_hours: 12,
    booking_start_minutes: 30,
    booking_end_hours: 14,
    booking_end_minutes: 0,
    table_name: "Стол 1",
    restaurant_name: "Ресторан А",
    booking_status_id: 1,
  },
  {
    booking_id: 2,
    booking_date: "2025-06-21",
    booking_start_hours: 18,
    booking_start_minutes: 0,
    booking_end_hours: 20,
    booking_end_minutes: 30,
    table_name: "Стол 5",
    restaurant_name: "Ресторан Б",
    booking_status_id: 2,
  },
];

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("UserBookings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("отображает список бронирований после загрузки", async () => {
    mockedAPI.get.mockResolvedValueOnce({ data: bookingsMock });

    renderWithRouter(<UserBookings />);

    expect(screen.getByText("Мои бронирования")).toBeInTheDocument();

    // Ожидаем появление данных
    await waitFor(() => {
      expect(screen.getByText("2025-06-20")).toBeInTheDocument();
      expect(screen.getByText("Стол 1 (Ресторан А)")).toBeInTheDocument();
      expect(screen.getByText("Оплачено")).toBeInTheDocument();
    });

    expect(screen.getByText("2025-06-21")).toBeInTheDocument();
    expect(screen.getByText("Стол 5 (Ресторан Б)")).toBeInTheDocument();
    expect(screen.getByText("Не оплачено")).toBeInTheDocument();
  });

  test("показывает сообщение об ошибке при ошибке загрузки", async () => {
    mockedAPI.get.mockRejectedValueOnce(new Error("Ошибка"));

    renderWithRouter(<UserBookings />);

    await waitFor(() => {
      expect(screen.getByText("Ошибка загрузки бронирований")).toBeInTheDocument();
    });
  });

});
