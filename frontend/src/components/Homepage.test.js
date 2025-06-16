import { render, screen } from "@testing-library/react";
import Homepage from "./Homepage";
import axios from "axios";
import * as Weather from "../Weather";
import { MemoryRouter } from "react-router-dom";

jest.mock("axios");
jest.mock("../Weather");

describe("Homepage", () => {
  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify({ _id: "user123" }));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("fetches and displays city names", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { _id: "c1", name: "City1", description: "Desc1" },
        { _id: "c2", name: "City2", description: "Desc2" },
      ],
    });

    Weather.getWeatherForCity.mockResolvedValue({
      weather: [{ description: "Sunny" }],
      main: { temp: 25 },
    });

    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    expect(await screen.findByText("City1")).toBeInTheDocument();
    expect(screen.getByText("City2")).toBeInTheDocument();
  });
});
