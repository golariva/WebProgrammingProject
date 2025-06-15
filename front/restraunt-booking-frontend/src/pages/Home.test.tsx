import { render, screen, waitFor } from "@testing-library/react";
import Home from "./Home";
import API from "../api";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';

// Мокаем API.get
jest.mock("../api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

// Мокаем useNavigate из react-router-dom
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("Home component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("рендерит базовый текст и кнопки для роли user_role_id=1", async () => {
    // Мокаем ответ API для user_role_id = 1
    (API.get as jest.Mock).mockResolvedValueOnce({
      data: { user_role_id: 1 },
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Проверяем базовый текст
    expect(screen.getByText(/Добро пожаловать в сервис бронирования/i)).toBeInTheDocument();
    expect(screen.getByText(/Выберите ресторан, этаж и столик/i)).toBeInTheDocument();

    // Ждем, пока кнопки с ролью 1 появятся
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Личный кабинет/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Список ресторанов/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Мои бронирования/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /О нас/i })).toBeInTheDocument();
    });
  });

  test("рендерит кнопки для роли user_role_id=2", async () => {
    // Мокаем ответ API для user_role_id = 2
    (API.get as jest.Mock).mockResolvedValueOnce({
      data: { user_role_id: 2 },
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Личный кабинет/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Панель администратора/i })).toBeInTheDocument();
    });

    // Кнопок для роли 1 не должно быть
    expect(screen.queryByRole("button", { name: /Список ресторанов/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Мои бронирования/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /О нас/i })).not.toBeInTheDocument();
  });

});
