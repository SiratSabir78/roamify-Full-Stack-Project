import { render, screen, fireEvent } from "@testing-library/react";
import CommunityForum from "./Communityforum";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

describe("CommunityForum", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem(
      "user",
      JSON.stringify({ username: "testuser", _id: "123" })
    );
  });

  test("fetches and displays questions", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "q1",
          title: "Question 1",
          description: "Desc 1",
          username: "user1",
          createdAt: new Date().toISOString(),
          answers: [],
        },
      ],
    });

    render(
      <MemoryRouter>
        <CommunityForum />
      </MemoryRouter>
    );

    expect(await screen.findByText("Question 1")).toBeInTheDocument();
  });

  test("shows ask question form when button clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <CommunityForum />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("+ Ask a Question"));
    expect(screen.getByPlaceholderText("Enter question title...")).toBeInTheDocument();
  });

  test("alerts when posting empty question", () => {
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <CommunityForum />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("+ Ask a Question"));
    fireEvent.click(screen.getByText("Post Question"));

    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields");
  });
});
