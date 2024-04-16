import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TimeElapsed from 'habitforge/components/Leaderboards/TimeElapsed.tsx';
import { act } from 'react-dom/test-utils';

// Mock timers and date to control the passage of time
jest.useFakeTimers();
const realDateNow = Date.now.bind(global.Date);
global.Date.now = jest.fn();

describe('TimeElapsed Component', () => {
  beforeEach(() => {
    // this sets a fake initial time
    global.Date.now.mockImplementation(() => new Date('2024-04-17T00:00:00.000Z').getTime());
  });

  afterEach(() => {
    jest.clearAllTimers();
    global.Date.now.mockRestore();
  });

  it('renders without crashing', () => {
    render(<TimeElapsed />);
    expect(screen.getByText(/Last Updated:/)).toBeInTheDocument();
  });

  it('cleans up the interval on unmount', () => {
    const setIntervalSpy = jest.spyOn(window, 'setInterval');
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = render(<TimeElapsed />);
    unmount();
    expect(setIntervalSpy).toHaveBeenCalled();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
