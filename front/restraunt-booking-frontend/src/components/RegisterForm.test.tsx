import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "./RegisterForm";
import API from "../api";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';

// Заглушка для стилей, чтобы не падал импорт CSS-модуля
jest.mock("../styles/RegisterForm.module.css", () => ({}));

// Мокаем useNavigate
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Мокаем API.post
jest.mock("../api", () => ({
  post: jest.fn(),
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("рендерит все поля и кнопку", () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Имя")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Телефон")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Пароль")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Повторите пароль")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /зарегистрироваться/i })).toBeInTheDocument();
  });

  test("показывает ошибку, если пароли не совпадают", async () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Пароль"), { target: { value: "123456" } });
    fireEvent.change(screen.getByPlaceholderText("Повторите пароль"), { target: { value: "654321" } });

    fireEvent.submit(screen.getByRole("button", { name: /зарегистрироваться/i }).closest("form")!);

    expect(await screen.findByText("Пароли не совпадают!")).toBeInTheDocument();
  });

  test("вызывает API.post при успешной регистрации", async () => {
    (API.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Имя"), { target: { value: "Тест" } });
    fireEvent.change(screen.getByPlaceholderText("Телефон"), { target: { value: "+79990001122" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Пароль"), { target: { value: "123456" } });
    fireEvent.change(screen.getByPlaceholderText("Повторите пароль"), { target: { value: "123456" } });

    fireEvent.submit(screen.getByRole("button", { name: /зарегистрироваться/i }).closest("form")!);

    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith("/auth/register", {
        name: "Тест",
        phone: "+79990001122",
        email: "test@example.com",
        password: "123456",
        confirmPassword: "123456",
      });
    });

    expect(screen.queryByText("Пароли не совпадают!")).not.toBeInTheDocument();
  });

  test("отображает ошибку, если API.post выбрасывает ошибку", async () => {
    (API.post as jest.Mock).mockRejectedValueOnce(new Error("Ошибка регистрации"));

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Имя"), { target: { value: "Тест" } });
    fireEvent.change(screen.getByPlaceholderText("Телефон"), { target: { value: "+79990001122" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Пароль"), { target: { value: "123456" } });
    fireEvent.change(screen.getByPlaceholderText("Повторите пароль"), { target: { value: "123456" } });

    fireEvent.submit(screen.getByRole("button", { name: /зарегистрироваться/i }).closest("form")!);

    expect(await screen.findByText("Ошибка регистрации")).toBeInTheDocument();
  });

  test("нажимает кнопку Войти и вызывает navigate", () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /войти в аккаунт/i });
    fireEvent.click(loginButton);

    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });
});
