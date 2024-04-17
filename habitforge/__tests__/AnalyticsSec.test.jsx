import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Analytics from "habitforge/components/Dashboard/analyticsSec.tsx";
import { useAuthState } from "react-firebase-hooks/auth";

jest.mock("react-firebase-hooks/auth");
jest.mock("habitforge/firebase/firebase.ts", () => ({
  auth: { currentUser: { uid: "testUid" } },
  db: {},
}));

describe("Analytics Component", () => {
  const commonProps = {
    habits: [
      {
        habitName: "Read",
        lastCompletedDate: { toDate: () => new Date(Date.now() - 86400000) }, // 1 day ago
        completed: true,
        totalCompletedWeekly: 7, // all days completed
        goal: 1,
        icon: "book-icon",
        color: "blue",
      },
      {
        habitName: "Exercise",
        lastCompletedDate: { toDate: () => new Date(Date.now() - 172800000) }, // 2 days ago
        completed: false,
        totalCompletedWeekly: 3, // half the days completed
        goal: 1,
        icon: "dumbbell-icon",
        color: "red",
      },
    ],
    user: { name: "John Doe" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthState.mockReturnValue([{ uid: "testUid" }, false, null]);
  });

  it("handles zero habits", () => {
    render(<Analytics {...commonProps} habits={[]} />);
    expect(
      screen.getByText("Start tracking your habits to see a weekly analytics.")
    ).toBeInTheDocument();
  });

  it("displays no data message when habits are empty", () => {
    const { getByText } = render(<Analytics {...commonProps} habits={[]} />);
    expect(
      getByText("Start tracking your habits to see a weekly analytics.")
    ).toBeInTheDocument();
  });
});
