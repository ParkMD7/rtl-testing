import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import HomeRoute from "./HomeRoute";
import { createServer } from "../test/server";

createServer([
  {
    path: "/api/repositories",
    res: (req, res, ctx) => {
      const query = req.url.searchParams.get("q");
      // extract language query param
      const language = query.split("language:")[1];
      return {
        items: [
          { id: 1234, full_name: `${language}_one` },
          { id: 5678, full_name: `${language}_two` },
        ],
      };
    },
  },
]);

test("it renders two links for each language fetched", async () => {
  // a child component has a Link component so need to add MemoryRouter
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );

  // expect to see 6 different tables - one for each request being made in HomeRoute
  // loop over each language && make sure we see two links
  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "java",
  ];

  for (let language of languages) {
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${language}_`),
    });

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(`${language}_one`);
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
    expect(links[1]).toHaveTextContent(`${language}_two`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
  }
});

// const pause = () => new Promise(resolve => {
//   setTimeout(resolve, 100)
// })
