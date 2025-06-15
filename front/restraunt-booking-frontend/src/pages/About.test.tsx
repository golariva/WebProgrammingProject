import { render, screen, fireEvent } from "@testing-library/react";
import About from "./About";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';

// Мокаем useNavigate
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("About page", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  test("рендерит заголовки, текст и список", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    // Проверяем заголовки
    expect(screen.getByRole("heading", { name: /о нашем сервисе/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /возможности веб-приложения/i })).toBeInTheDocument();

    // Проверяем тексты
    expect(screen.getByText(/добро пожаловать в сервис бронирования столиков/i)).toBeInTheDocument();
    expect(screen.getByText(/комфортный отдых начинается с комфортного планирования/i)).toBeInTheDocument();

    // Проверяем список
    expect(screen.getByText(/выбор ресторана из списка/i)).toBeInTheDocument();
    expect(screen.getByText(/бронирование столика на выбранном этаже/i)).toBeInTheDocument();
    expect(screen.getByText(/отслеживание своих броней в личном кабинете/i)).toBeInTheDocument();

    // Кнопка
    expect(screen.getByRole("button", { name: /вернуться на главную/i })).toBeInTheDocument();
  });

  test("при клике на кнопку вызывается navigate с '/'", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /вернуться на главную/i });
    fireEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });
});
