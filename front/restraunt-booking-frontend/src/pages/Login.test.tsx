import { render, screen } from "@testing-library/react";
import UserProfile from "./Login";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as api from "../api";  // Импортируем модуль с getUserProfile
jest.mock("../api"); // Мокаем весь модуль api
import '@testing-library/jest-dom';

describe("UserProfile component", () => {
  const mockUser = {
    user_id: 1,
    user_name: "John Doe",
    user_email: "john@example.com",
    user_phone: "+123456789",
    user_created_date: "2023-01-01T00:00:00Z",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("отображает профиль пользователя", async () => {
    // Мокаем getUserProfile, чтобы вернуть успешный ответ
    (api.getUserProfile as jest.Mock).mockResolvedValue(mockUser);

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </MemoryRouter>
    );

    // Ждем, пока данные пользователя появятся на экране
    expect(await screen.findByText("Личный кабинет")).toBeInTheDocument();
    expect(screen.getByText(mockUser.user_name)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${mockUser.user_email}`)).toBeInTheDocument();
    expect(screen.getByText(`Телефон: ${mockUser.user_phone}`)).toBeInTheDocument();
  });
});
