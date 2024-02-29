import { screen, render } from "@testing-library/react";
import RepositoriesSummary from "./RepositoriesSummary";

test("it displays all relevant information about the repository", () => {
  const mockRepo = {
    stargazers_count: 5,
    open_issues: 7,
    forks: 10,
    language: "Javascript",
  };

  render(<RepositoriesSummary repository={mockRepo} />)
  // one way to write assertions 
  // const language = screen.getByText("Javascript");
  // expect(language).toBeInTheDocument();

  // more concise way to loop through information
  for (let key in mockRepo) {
    const value = mockRepo[key];
    const element = screen.getByText(new RegExp(value));
    expect(element).toBeInTheDocument();
  }
});
