import { render, screen, fireEvent } from "@testing-library/react";
import AdminPanel from "./AdminPanel";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';

// Мок для API
jest.mock("../api", () => ({
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

import API from "../api";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("AdminPanel", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  test("рендерит заголовок и кнопку", async () => {
    (API.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /панель администратора/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /назад/i })).toBeInTheDocument();
  });

  test("кнопка 'назад' вызывает navigate", async () => {
    (API.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );

    const backBtn = screen.getByRole("button", { name: /назад/i });
    fireEvent.click(backBtn);

    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });
});
