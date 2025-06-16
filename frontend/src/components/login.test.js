import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Helper to wrap components with routing
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login Component", () => {
  test("renders email and password inputs and login button", () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("shows error on failed login", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: "Invalid credentials" } },
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("stores token and user in localStorage on success", async () => {
    const fakeUser = { email: "test@example.com", _id: "123" };
    const fakeToken = "fake-jwt-token";

    axios.post.mockResolvedValueOnce({
      data: { user: fakeUser, token: fakeToken },
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe(fakeToken);
      expect(localStorage.getItem("user")).toBe(JSON.stringify(fakeUser));
    });
  });
});
