import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Home from "habitforge/app/audio/page.tsx";

describe("Home Component", () => {
  const originalAudio = global.Audio;
  const mockPlay = jest.fn();

  beforeEach(() => {
    global.Audio = jest.fn(() => ({
      play: mockPlay,
    }));
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  afterEach(() => {
    global.Audio = originalAudio;
  });

  // Tests for sound playing correctly when not muted
  const buttons = ["Level Up", "Success", "Skipped", "Completed", "Error"];
  buttons.forEach((button) => {
    it(`plays ${button} sound when not muted`, () => {
      render(<Home />);
      fireEvent.click(screen.getByText(button));
      expect(mockPlay).toHaveBeenCalledTimes(1);
    });
  });

  // Test to ensure no sound is played when muted
  buttons.forEach((button) => {
    it(`does not play ${button} sound when muted`, () => {
      render(<Home />);
      fireEvent.click(screen.getByText("Mute"));
      fireEvent.click(screen.getByText(button));
      expect(mockPlay).not.toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith(
        "The page is muted. Please unmute to play sounds."
      );
    });
  });

  // Test toggling mute state repeatedly
  it("toggles mute state repeatedly", () => {
    render(<Home />);
    const toggleButton = screen.getByText("Mute");
    fireEvent.click(toggleButton); // First click
    fireEvent.click(toggleButton); // Second click
    fireEvent.click(toggleButton); // Third click
    expect(global.alert).toHaveBeenCalledTimes(3); // Check if alert was called three times
  });

  // Test a sequence of interactions
  it("handles a sequence of interactions", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Success"));
    expect(mockPlay).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText("Mute"));
    fireEvent.click(screen.getByText("Error"));
    expect(mockPlay).toHaveBeenCalledTimes(1); // No new sound should be played
    fireEvent.click(screen.getByText("Unmute"));
    fireEvent.click(screen.getByText("Completed"));
    expect(mockPlay).toHaveBeenCalledTimes(2);
  });
});
