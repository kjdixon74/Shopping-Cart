import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Products", () => {
  render(<App />);
  const heading = screen.getByText("Product List");
  expect(heading).toBeInTheDocument();
});
