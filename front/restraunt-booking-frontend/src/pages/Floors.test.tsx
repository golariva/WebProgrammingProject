import { render, screen, waitFor } from "@testing-library/react";
import Floors from "./Floors";
import API from "../api";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import '@testing-library/jest-dom';

// Мокаем API.get
jest.mock("../api", () => ({
  get: jest.fn(),
}));

// Мокаем useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockedUsedNavigate,
  };
});

describe("Floors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("загружает и отображает этажи", async () => {
    // Задаём что вернет API
    (API.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { floor_id: 1, floor_name: "Первый" },
        { floor_id: 2, floor_name: "Второй" },
      ],
    });

    // Рендерим с MemoryRouter и параметром restaurant_id
    render(
      <MemoryRouter initialEntries={["/restaurant/123/floors"]}>
        <Routes>
          <Route path="/restaurant/:restaurant_id/floors" element={<Floors />} />
        </Routes>
      </MemoryRouter>
    );

    // Проверяем заголовок
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Выберите этаж");

    // Ждем появления этажей
    await waitFor(() => {
      expect(screen.getByText("Этаж Первый")).toBeInTheDocument();
      expect(screen.getByText("Этаж Второй")).toBeInTheDocument();
    });

    // Кнопки забронировать должны быть
    const bookingButtons = screen.getAllByRole("button", { name: "Забронировать" });
    expect(bookingButtons).toHaveLength(2);
  });
});
