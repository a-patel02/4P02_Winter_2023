import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useAuthState } from "react-firebase-hooks/auth";
import Footer from "habitforge/components/Footer";

// Mocking react-firebase-hooks/auth
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

// Mocking Next.js Link
jest.mock("next/link", () => {
  return ({ children }) => children;
});
jest.mock("firebase/messaging", () => ({
  getMessaging: jest.fn(() => ({
    onMessage: jest.fn(),
    getToken: jest.fn(() => Promise.resolve("mock-token")),
  })),
}));

describe("Footer Component", () => {
  describe("Always visible elements", () => {
    it("renders the home link", () => {
      // Mock user not authenticated
      useAuthState.mockReturnValue([null, false, null]);
      render(<Footer />);
      expect(screen.getByText("HabitForge")).toBeInTheDocument();
    });
  });

  describe("Conditional elements based on authentication", () => {
    it("does not render the dashboard button when user is not authenticated", () => {
      // Mock user not authenticated
      useAuthState.mockReturnValue([null, false, null]);
      render(<Footer />);
      const dashboardButton = screen.queryByText("Dashboard");
      expect(dashboardButton).toBeNull();
    });

    it("renders the dashboard button when user is authenticated", () => {
      // Mock user authenticated
      useAuthState.mockReturnValue([
        {
          /* Mock user object */
        },
        false,
        null,
      ]);
      render(<Footer />);
      const dashboardButton = screen.getByText("Dashboard");
      expect(dashboardButton).toBeInTheDocument();
    });
  });
});
