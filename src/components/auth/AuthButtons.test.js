import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "../../test/server";

import AuthButtons from "./AuthButtons";

const renderComponent = async () => {
  render(
    <MemoryRouter>
      <AuthButtons />
    </MemoryRouter>
  )

  await screen.findAllByRole("link");
}

describe("when user is not signed in", () => {
  createServer([
    {
      path: "/api/user",
      res: () => {
        return { user: null };
      },
    },
  ]);

  test("the sign in and sign up buttons are visible", async () => {
    await renderComponent()

    const signInButton = screen.getByRole("link", { name: /sign in/i });
    const signUpButton = screen.getByRole("link", { name: /sign up/i });

    expect(signInButton).toBeInTheDocument()
    expect(signInButton).toHaveAttribute("href", "/signin")
    expect(signUpButton).toBeInTheDocument()
    expect(signUpButton).toHaveAttribute("href", "/signup")
  });

  test("the sign out button is not visible", async () => {
    await renderComponent()

    // query by role returns null if not found (getByRole would potentially throw an error)
    const signOutButton = screen.queryByRole("link", { name: /sign out/i });
    expect(signOutButton).not.toBeInTheDocument()
  });
});

describe("when user is signed in", () => {
  createServer([
    {
      path: "/api/user",
      res: () => {
        return { user: { id: 7, email: "guy@flavortown.com" } };
      },
    },
  ]);

  test("the sign in and sign up buttons are not visible", async () => {
    await renderComponent()

    const signInButton = screen.queryByRole("link", { name: /sign in/i });
    const signUpButton = screen.queryByRole("link", { name: /sign up/i });

    expect(signInButton).not.toBeInTheDocument()
    expect(signUpButton).not.toBeInTheDocument()
  });

  test("the sign out button is visible", async () => {
    await renderComponent()

    const signOutButton = screen.getByRole("link", { name: /sign out/i });

    expect(signOutButton).toBeInTheDocument()
    expect(signOutButton).toHaveAttribute("href", "/signout")
  });
});
