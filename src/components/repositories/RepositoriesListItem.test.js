import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RepositoriesListItem from "./RepositoriesListItem";

// jest.mock("../tree/FileIcon", () => {
//   return () => {
//     return "File Icon Component";
//   };
// });

const renderComponent = () => {
  const mockRepo = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "a js library",
    owner: {
      login: "facebook",
    },
    name: "react",
    html_url: "https://github.com/facebook/react",
  };

  render(
    <MemoryRouter>
      <RepositoriesListItem repository={mockRepo} />
    </MemoryRouter>
  );

  return { mockRepo };
};

test("shows a link to the github homepage for an individual repo", async () => {
  const { mockRepo } = renderComponent();

  // there is some data fetching going on in a useEffect hook within a child component
  // using RTL "findBy" or "findAllBy" has built in use of "act" from react-router-dom/testing
  // "findBy" or "findAllBy" wait for useEffect to finish before executing
  await screen.findByRole("img", { name: "Javascript" });

  // an alternative solution is to override the child component causing the issue with the async useEffect is to mock it.
  // that code is commented out at the top of this file

  const link = screen.getByRole("link", { name: /github repository/i });

  expect(link).toHaveAttribute("href", mockRepo.html_url);
});

test("shows a fileicon with the appropriate icon", async () => {
  renderComponent();

  const icon = await screen.findByRole("img", { name: "Javascript" });

  expect(icon).toHaveClass("js-icon");
});

test("shows a link to the appropriate repo", async () => {
  const { mockRepo } = renderComponent();

  await screen.findByRole("img", { name: "Javascript" });
  
  const link = screen.getByRole("link", { name: new RegExp(mockRepo.owner.login) });

  expect(link).toHaveAttribute("href", `/repositories/${mockRepo.full_name}`);
});
