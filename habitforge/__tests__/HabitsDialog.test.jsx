import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import HabitsDialog from "habitforge/components/Dashboard/HabitsDialog.tsx";
import { useAuthState } from "react-firebase-hooks/auth";
import * as firebase from "habitforge/firebase/firebase.ts";
import { getByText } from "@testing-library/dom";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
  serverTimestamp: jest.fn(),
}));

jest.mock("@/firebase/firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

// Mock Firebase hooks and Firestore methods
jest.mock("react-firebase-hooks/auth");
jest.mock("@/firebase/firebase", () => ({
  auth: { currentUser: { uid: "testUid" } },
  db: {},
}));

// Mock Firestore methods
jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

jest.mock("habitforge/firebase/firebase.ts", () => ({
  auth: { currentUser: { uid: "testUid" } },
  db: {},
}));

jest.mock("habitforge/firebase/firebase.ts");

// Mock matchMedia
beforeAll(() => {
  window.matchMedia = jest.fn().mockImplementation((query) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });
});
describe("HabitsDialog Component", () => {
  // Setup common props if needed
  const commonProps = {
    edit: false,
    hUID: null,
    habitName: "",
    goal: 1,
    color: "blue",
    icon: "Sun",
    repeat: "daily",
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    useAuthState.mockReturnValue([{ uid: "testUid" }, false, null]);
  });

  it("renders add habit dialog correctly", () => {
    const { getByText } = render(<HabitsDialog {...commonProps} />);
    expect(getByText("Add Habit")).toBeInTheDocument();
  });

  it("opens the dialog when the trigger button is clicked", () => {
    const { getByText } = render(<HabitsDialog {...commonProps} />);
    fireEvent.click(getByText("Add Habit"));
    expect(getByText("New Habit")).toBeInTheDocument();
  });
});
