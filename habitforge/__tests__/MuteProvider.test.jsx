import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import {
  MuteProvider,
  useMute,
} from "habitforge/components/Dashboard/MuteProvider.tsx";

const ComponentForUse = () => {
  const { muted } = useMute();
  return <p>{muted ? "Muted" : "Not muted"}</p>;
};
const TestComponent = () => {
  const { muted, setMuted } = useMute();
  return (
    <div>
      <button onClick={() => setMuted(!muted)}>
        {muted ? "Unmute" : "Mute"}
      </button>
      <p>{muted ? "Muted" : "Not muted"}</p>
    </div>
  );
};

describe("MuteProvider", () => {
  it("initializes with muted as false", () => {
    render(
      <MuteProvider>
        <TestComponent />
      </MuteProvider>
    );
    expect(screen.getByText("Not muted")).toBeInTheDocument();
  });

  it("allows mute state to be toggled", () => {
    render(
      <MuteProvider>
        <TestComponent />
      </MuteProvider>
    );
    fireEvent.click(screen.getByText("Mute"));
    expect(screen.getByText("Muted")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Unmute"));
    expect(screen.getByText("Not muted")).toBeInTheDocument();
  });

  it("useMute hook provides context correctly", () => {
    render(
      <MuteProvider>
        <TestComponent />
      </MuteProvider>
    );
    const muteButton = screen.getByRole("button", { name: /mute/i });
    fireEvent.click(muteButton);
    expect(screen.getByText("Muted")).toBeInTheDocument();
  });

  it("updates all components subscribed to the context", () => {
    render(
      <MuteProvider>
        <TestComponent />
        <ComponentForUse />
      </MuteProvider>
    );
    fireEvent.click(screen.getByText("Mute"));
    const texts = screen.getAllByText("Muted");
    expect(texts.length).toBe(2); // Both components display "Muted"
  });

  it("uses default values without provider", () => {
    render(<ComponentForUse />); // This  does not have a MuteProvider
    expect(screen.getByText("Not muted")).toBeInTheDocument();
  });
});
