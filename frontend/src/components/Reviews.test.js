import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Reviews from "./Reviews";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

jest.mock("axios");

describe("Reviews Component", () => {
  const user = { _id: "user123" };

  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify(user));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("fetches and displays user reviews grouped by city", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "city1",
          name: "CityOne",
          reviews: [
            { id: "r1", userId: "user123", text: "Great place!", rating: 5 },
            { id: "r2", userId: "other", text: "Not mine", rating: 3 },
          ],
        },
        {
          _id: "city2",
          name: "CityTwo",
          reviews: [
            { id: "r3", userId: "user123", text: "Loved it", rating: 4 },
          ],
        },
      ],
    });

    render(
      <MemoryRouter>
        <Reviews />
      </MemoryRouter>
    );

    expect(await screen.findByText("CityOne")).toBeInTheDocument();
    expect(screen.getByText("Great place!")).toBeInTheDocument();
    expect(screen.queryByText("Not mine")).not.toBeInTheDocument();
    expect(screen.getByText("CityTwo")).toBeInTheDocument();
    expect(screen.getByText("Loved it")).toBeInTheDocument();
  });

  test("deletes a review and updates UI", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "city1",
          name: "CityOne",
          reviews: [{ id: "r1", userId: "user123", text: "Awesome", rating: 5 }],
        },
      ],
    });

    axios.delete.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <Reviews />
      </MemoryRouter>
    );

    // Wait for review to appear
    expect(await screen.findByText("Awesome")).toBeInTheDocument();

    // Click delete button
    fireEvent.click(screen.getByText("Delete"));

    // Wait for review to be removed
    await waitFor(() =>
      expect(screen.queryByText("Awesome")).not.toBeInTheDocument()
    );
  });
});
