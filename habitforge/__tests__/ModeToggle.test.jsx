import { render, screen, fireEvent } from "@testing-library/react";
import { ModeToggle } from "habitforge/components/ModeToggle.tsx";
import { Moon, Sun } from "lucide-react";

jest.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: jest.fn(),
  }),
}));

describe("ModeToggle", () => {
  it("renders ModeToggle component", () => {
    render(<ModeToggle />);
    const modeToggleElement = screen.getByRole("button", {
      name: "Toggle theme",
    });
    expect(modeToggleElement).toBeInTheDocument();
  });

  it("displays correct icon based on theme", () => {
    render(<ModeToggle />);
    const sunIcon = screen.getByTestId("sun-icon");
    const moonIcon = screen.getByTestId("moon-icon");
    expect(sunIcon).toHaveClass("rotate-0 scale-100");
    expect(moonIcon).toHaveClass("rotate-90 scale-0");
  });
});
