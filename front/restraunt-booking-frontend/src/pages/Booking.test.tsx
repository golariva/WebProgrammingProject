// src/pages/Booking.test.tsx
import { render, screen } from "@testing-library/react";
import Booking from "./Booking";
import '@testing-library/jest-dom';

jest.mock("../components/BookingForm", () => () => <div data-testid="booking-form">BookingForm Component</div>);

describe("BookingPage", () => {
  it("рендерит компонент BookingForm", () => {
    render(<Booking />);
    expect(screen.getByTestId("booking-form")).toBeInTheDocument();
  });
});

