import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Favourites from "./Favourites";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

jest.mock("axios");

// Create a mock navigate function variable
const mockNavigate = jest.fn();

// Mock react-router-dom once, at the top-level:
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Favourites Component", () => {
  const user = { _id: "user123" };

  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify(user));
    mockNavigate.mockReset(); // reset call history before each test
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("redirects to /Login if no user in localStorage", () => {
    localStorage.clear();

    render(
      <MemoryRouter>
        <Favourites />
      </MemoryRouter>
    );

    // The navigation happens inside useEffect, so we might want to wait for it
    expect(mockNavigate).toHaveBeenCalledWith("/Login");
  });

  test("fetches and displays favorite cities", async () => {
    axios.get.mockImplementation((url) => {
      if (url === `http://localhost:5000/users/${user._id}`) {
        return Promise.resolve({
          data: { favouriteCities: ["c1", "c2"] },
        });
      } else if (url === `http://localhost:5000/cities/c1`) {
        return Promise.resolve({
          data: { _id: "c1", name: "City1", description: "Desc1" },
        });
      } else if (url === `http://localhost:5000/cities/c2`) {
        return Promise.resolve({
          data: { _id: "c2", name: "City2", description: "Desc2" },
        });
      }
      return Promise.reject(new Error("not found"));
    });

    render(
      <MemoryRouter>
        <Favourites />
      </MemoryRouter>
    );

    expect(await screen.findByText("City1")).toBeInTheDocument();
    expect(screen.getByText("City2")).toBeInTheDocument();
  });

  test("removes city from favorites on button click", async () => {
    axios.get.mockImplementation((url) => {
      if (url === `http://localhost:5000/users/${user._id}`) {
        return Promise.resolve({
          data: { favouriteCities: ["c1"] },
        });
      } else if (url === `http://localhost:5000/cities/c1`) {
        return Promise.resolve({
          data: { _id: "c1", name: "City1", description: "Desc1" },
        });
      }
      return Promise.reject(new Error("not found"));
    });

    axios.post.mockResolvedValueOnce({
      data: { favorites: [] },
    });

    render(
      <MemoryRouter>
        <Favourites />
      </MemoryRouter>
    );

    const removeBtn = await screen.findByText("Remove from Favorites");
    fireEvent.click(removeBtn);

    await waitFor(() =>
      expect(screen.queryByText("City1")).not.toBeInTheDocument()
    );
  });
});
