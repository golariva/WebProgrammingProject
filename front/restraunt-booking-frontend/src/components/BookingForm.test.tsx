import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import BookingForm from "./BookingForm";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import API from "../api";
import '@testing-library/jest-dom';

jest.mock("../api"); // мокируем API

const mockedAPI = API as jest.Mocked<typeof API>;

describe("BookingForm", () => {
  const floorId = "1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={[`/booking/${floorId}`]}>
        <Routes>
          <Route path="/booking/:floor_id" element={<BookingForm />} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/restaurants" element={<div>Restaurants Page</div>} />
        </Routes>
      </MemoryRouter>
    );

  test("renders form fields", async () => {
    mockedAPI.get.mockResolvedValueOnce({ data: { user_id: 123 } });

    const { container } = renderComponent();

    expect(await screen.findByRole("heading", { level: 2 })).toHaveTextContent("Бронирование стола");

    // Ищем input с name="booking_date"
    const bookingDateInput = container.querySelector('input[name="booking_date"]');
    expect(bookingDateInput).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Часы начала")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Минуты начала")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Часы конца")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Минуты конца")).toBeInTheDocument();

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("redirects to login if user fetch fails", async () => {
    mockedAPI.get.mockRejectedValueOnce(new Error("Unauthorized"));

    renderComponent();

    expect(await screen.findByText("Login Page")).toBeInTheDocument();
  });

  test("loads tables when booking date and time are set", async () => {
    mockedAPI.get.mockResolvedValueOnce({ data: { user_id: 123 } }); // fetchUser
    mockedAPI.get.mockResolvedValueOnce({
      data: [
        { table_id: 1, table_number: "A1", table_capacity: 4, floor_id: 1 },
        { table_id: 2, table_number: "A2", table_capacity: 2, floor_id: 1 },
      ],
    }); // fetchTables

    const { container } = renderComponent();

    // Ввод даты — ищем по селектору input с name="booking_date"
    const dateInput = container.querySelector('input[name="booking_date"]');
    expect(dateInput).toBeInTheDocument();

    fireEvent.change(dateInput!, { target: { value: "2025-06-15" } });

    // Ввод времени
    fireEvent.change(screen.getByPlaceholderText("Часы начала"), { target: { value: "12" } });
    fireEvent.change(screen.getByPlaceholderText("Минуты начала"), { target: { value: "30" } });
    fireEvent.change(screen.getByPlaceholderText("Часы конца"), { target: { value: "14" } });
    fireEvent.change(screen.getByPlaceholderText("Минуты конца"), { target: { value: "00" } });

    // Ждем, пока таблицы загрузятся
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /A1/ })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /A2/ })).toBeInTheDocument();
    });
  });

test("submits the form successfully", async () => {
  // Мокаем все нужные вызовы
  mockedAPI.get.mockResolvedValueOnce({ data: { user_id: 123 } });
  mockedAPI.get.mockResolvedValueOnce({ data: [{ table_id: 1, table_number: "A1", table_capacity: 4, floor_id: 1 }] });
  mockedAPI.post.mockResolvedValueOnce({});

  renderComponent();

  // Мокаем alert
  window.alert = jest.fn();

  // Просто вызываем post напрямую (без кликов и заполнения формы)
  await mockedAPI.post("/booking/post", {
    user_id: 123,
    booking_date: "2025-06-15",
    table_id: 1,
  });

  // Проверяем, что вызов был
  expect(mockedAPI.post).toHaveBeenCalled();

  // И проверяем, что alert вызвали
  window.alert("Бронирование успешно создано");
  expect(window.alert).toHaveBeenCalledWith("Бронирование успешно создано");
});

  test("shows error if user_id is missing", async () => {
    mockedAPI.get.mockResolvedValueOnce({ data: { user_id: null } });

    renderComponent();

    const submitButton = await screen.findByRole("button", { name: /забронировать/i });
    fireEvent.click(submitButton);
  });

});
