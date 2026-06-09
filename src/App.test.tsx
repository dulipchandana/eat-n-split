import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App component", () => {
  it("renders the app title and initial friends", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /splitwise/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /clark/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /sarah/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /anthony/i })).toBeInTheDocument();
  });

  it("opens and closes the Add Friend form", async () => {
    const user = userEvent;
    render(<App />);

    const addButton = screen.getByRole("button", { name: /\+ add friend/i });
    await user.click(addButton);

    expect(screen.getByLabelText(/friend name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/friend image url/i)).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(screen.queryByLabelText(/friend name/i)).not.toBeInTheDocument();
  });

  it("adds a new friend when the form is submitted", async () => {
    const user = userEvent;
    render(<App />);

    await user.click(screen.getByRole("button", { name: /\+ add friend/i }));
    await user.type(screen.getByLabelText(/friend name/i), "Maya");
    await user.clear(screen.getByLabelText(/friend image url/i));
    await user.type(screen.getByLabelText(/friend image url/i), "https://example.com/maya.png");
    await user.click(screen.getByRole("button", { name: /^Add$/i }));

    expect(await screen.findByRole("heading", { name: /maya/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/friend name/i)).not.toBeInTheDocument();
  });

  it("selects a friend and shows the split bill form", async () => {
    const user = userEvent;
    render(<App />);

    const selectButtons = screen.getAllByRole("button", { name: /select/i });
    await user.click(selectButtons[0]);

    expect(screen.getByRole("heading", { name: /split a bill with/i })).toBeInTheDocument();
    expect(screen.getByText(/split a bill with.*clark/i)).toBeInTheDocument();
  });

  it("splits the bill and updates the friend balance", async () => {
    const user = userEvent;
    render(<App />);

    const selectButtons = screen.getAllByRole("button", { name: /select/i });
    await user.click(selectButtons[0]);

    await user.type(screen.getByLabelText(/bill value/i), "100");
    await user.type(screen.getByLabelText(/your expense/i), "60");
    await user.selectOptions(screen.getByLabelText(/who is paying the bill/i), "user");
    await user.click(screen.getByRole("button", { name: /split bill/i }));

    expect(await screen.findByText(/clark\s* owes you/i)).toBeInTheDocument();
    expect(screen.getByText(/\$33/)).toBeInTheDocument();
  });

  it("clamps user expense to bill value when input exceeds total", async () => {
    const user = userEvent;
    render(<App />);

    const selectButtons = screen.getAllByRole("button", { name: /select/i });
    await user.click(selectButtons[0]);

    await user.type(screen.getByLabelText(/bill value/i), "50");
    await user.type(screen.getByLabelText(/your expense/i), "100");

    expect(screen.getByLabelText(/clark's expense/i)).toHaveValue("0");
  });
});
