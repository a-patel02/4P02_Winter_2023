import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GroupHabits from "habitforge/components/Dashboard/GroupHabits.tsx";
import GroupHabitsDialog from "habitforge/components/Dashboard/GroupHabitsDialog.tsx";
import Habits from "habitforge/components/Habits.tsx";

jest.mock("habitforge/components/Dashboard/GroupHabitsDialog.tsx", () => () => (
  <div>GroupHabitsDialogMock</div>
));
jest.mock("habitforge/components/Habits.tsx", () => () => (
  <div>HabitsMock</div>
));

describe("GroupHabits", () => {
  const mockHabits = [
    {
      hUID: "1",
      habitName: "Exercise",
      goal: 1,
      streak: 5,
      totalCompleted: 30,
      totalFailed: 3,
      totalSkipped: 2,
      completed: true,
      skipped: false,
      failed: false,
      color: "blue",
      icon: "run",
      tracked: true,
      groupID: "group1",
      repeat: "daily",
    },
  ];
  const mockUser = {
    uid: "user123",
  };

  it("renders the group habits title", () => {
    render(<GroupHabits sortedHabits={mockHabits} user={mockUser} />);
    expect(screen.getByText("Group Habits")).toBeInTheDocument();
  });

  it("renders Habits components for each habit when there are habits", () => {
    render(<GroupHabits sortedHabits={mockHabits} user={mockUser} />);
    expect(screen.getAllByText("HabitsMock").length).toBe(mockHabits.length);
  });

  it("renders no habits message when there are no habits", () => {
    render(<GroupHabits sortedHabits={[]} user={mockUser} />);
    expect(
      screen.getByText("Join or Create a Group Habit")
    ).toBeInTheDocument();
  });

  it("displays the GroupHabitsDialog when the manage habits button is toggled", () => {
    render(<GroupHabits sortedHabits={mockHabits} user={mockUser} />);
    const manageButton = screen.getAllByRole("button")[0];
    fireEvent.click(manageButton);
    expect(screen.getByText("GroupHabitsDialogMock")).toBeInTheDocument();
  });
  it("displays a specific message when there are no habits and manage is toggled", () => {
    render(<GroupHabits sortedHabits={[]} user={mockUser} />);
    const manageButton = screen.getAllByRole("button")[0];
    fireEvent.click(manageButton);
    expect(
      screen.getByText("Join or Create a Group Habit")
    ).toBeInTheDocument();
  });
  it("renders multiple Habits components correctly", () => {
    const moreHabits = [...mockHabits, { ...mockHabits[0], hUID: "2" }];
    render(<GroupHabits sortedHabits={moreHabits} user={mockUser} />);
    expect(screen.getAllByText("HabitsMock").length).toBe(moreHabits.length);
  });
  it("handles an empty sortedHabits array gracefully", () => {
    render(<GroupHabits sortedHabits={[]} user={mockUser} />);
    expect(
      screen.getByText("Join or Create a Group Habit")
    ).toBeInTheDocument();
    expect(screen.queryByText("HabitsMock")).toBeNull();
  });
});
