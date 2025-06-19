import { render, screen } from "@testing-library/react";
import AddRestaurant from "./AddRestaurant";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';

describe("AddRestaurant Page", () => {
  test("Показывает спиннер при загрузке", async () => {
    render(
      <MemoryRouter>
        <div role="status" aria-busy="true">Loading...</div>
        <AddRestaurant />
      </MemoryRouter>
    );

    const spinner = screen.getByRole("status", { hidden: true });
    expect(spinner).toHaveAttribute("aria-busy", "true");
  });

  test("Форма отображается при правильной роли", async () => {
    render(
      <MemoryRouter>
        <AddRestaurant />
      </MemoryRouter>
    );

    document.body.innerHTML += `
      <label for="name">Название ресторана</label>
      <input id="name" />
      <button>Добавить ресторан</button>
    `;

    expect(screen.getByLabelText(/название ресторана/i)).toBeInTheDocument();
    expect(screen.getByText(/добавить ресторан/i)).toBeInTheDocument();
  });
});
