import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";
import * as api from "../api";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock("../api");

describe("AdminLogin component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders email and password inputs and login button", () => {
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("shows error message when login fails", async () => {
    // Setup the mock to reject (simulate failed login)
    api.adminLogin.mockRejectedValueOnce(new Error("Login failed"));

    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });

    // navigate should not be called on failure
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test("navigates to admin dashboard on successful login", async () => {
    // Setup mock for successful login response
    api.adminLogin.mockResolvedValueOnce({
      data: {
        admin: { isAdmin: true },
      },
    });

    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/admin-dashboard");
    });

    // Error message should NOT be visible
    expect(screen.queryByText(/login failed/i)).not.toBeInTheDocument();
  });

  test("shows error message if user is not admin", async () => {
    api.adminLogin.mockResolvedValueOnce({
      data: {
        admin: { isAdmin: false },
        message: "Not an admin user",
      },
    });

    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/not an admin user/i)).toBeInTheDocument();
    });

    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});
