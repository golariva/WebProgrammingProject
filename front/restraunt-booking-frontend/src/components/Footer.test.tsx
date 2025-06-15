import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import '@testing-library/jest-dom';

describe("Footer", () => {
  test("рендерит текст с авторскими правами", () => {
    render(<Footer />);
    const footerText = screen.getByText(/© 2025 Restaurant Booking. Все права защищены./i);
    expect(footerText).toBeInTheDocument();
  });

  test("имеет правильный стиль", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo"); // semantic role for footer
    expect(footer).toHaveStyle({
      padding: "10px",
      marginTop: "20px",
      borderTop: "1px solid #ddd",
      textAlign: "center",
    });
  });
});
