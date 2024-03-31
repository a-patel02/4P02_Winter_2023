import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import Habits from 'habitforge/components/Habits.tsx';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
  serverTimestamp: jest.fn(),
}));

jest.mock('@/firebase/firebase', () => ({
  db: {},
}));

jest.mock('sonner', () => ({
  toast: {
    info: jest.fn(),
  },
}));

describe('Habits Component', () => {
    // ive created a mock user so we can test based off this.
  const mockProps = {
    habitName: 'Read',
    goal: 1,
    streak: 5,
    totalSkipped: 2,
    totalFailed: 1,
    totalCompleted: 10,
    completed: false,
    skipped: false,
    failed: false,
    hUID: 'habit123',
    uid: 'user123',
    color: 'blue',
    icon: 'ReadIcon',
    tracked: false,
    manage: false,
  };

  it('renders habit information correctly', () => {
    render(<Habits {...mockProps} />);
    expect(screen.getByText('Read')).toBeInTheDocument();
    expect(screen.getByText('1 /times a day')).toBeInTheDocument();
    expect(screen.getByText('5 day(s)')).toBeInTheDocument();
  });

  describe('Interaction Logic', () => {
    it('calls updateDoc on handleCompleted click', async () => {
      render(<Habits {...mockProps} />);
      fireEvent.click(screen.getByText('Done'));
      expect(updateDoc).toHaveBeenCalled();
    });

    it('calls updateDoc on handleFailed click', async () => {
      render(<Habits {...mockProps} />);
      fireEvent.click(screen.getByText('Fail'));
      expect(updateDoc).toHaveBeenCalled();
    });

    it('calls updateDoc on handleSkipped click', async () => {
      render(<Habits {...mockProps} />);
      fireEvent.click(screen.getByText('Skip'));
      expect(updateDoc).toHaveBeenCalled();
    });

    it('calls deleteDoc and shows a toast on delete', async () => {
      render(<Habits {...mockProps} manage={true} />);
      fireEvent.click(screen.getByText('Delete Habit'));
      expect(deleteDoc).toHaveBeenCalled();
      expect(toast.info).toHaveBeenCalledWith('Habit Deleted 😢');
    });

    it('displays the correct state when habit is already completed', () => {
      render(<Habits {...mockProps} completed={true} tracked={true} />);
      expect(screen.getByText('Completed, log again tomorrow')).toBeInTheDocument();
      expect(screen.queryByText('Done')).toBeNull(); // Done button should not be present
    });

    it('displays the correct state when habit is failed', () => {
      render(<Habits {...mockProps} failed={true} tracked={true} />);
      expect(screen.getByText('Failed, log again tomorrow')).toBeInTheDocument();
      expect(screen.queryByText('Fail')).toBeNull(); // Fail button should not be present
    });

    it('displays the correct state when habit is skipped', () => {
      render(<Habits {...mockProps} skipped={true} tracked={true} />);
      expect(screen.getByText('Skipped, log again tomorrow')).toBeInTheDocument();
      expect(screen.queryByText('Skip')).toBeNull(); // Skip button should not be present
    });

    describe('Managing habits', () => {
      it('shows manage options when manage prop is true', () => {
        render(<Habits {...mockProps} manage={true} />);
        expect(screen.getByText('Delete Habit')).toBeInTheDocument();
      });

      it('does not show action buttons when manage prop is true', () => {
        render(<Habits {...mockProps} manage={true} tracked={false} />);
        expect(screen.queryByText('Done')).toBeNull();
        expect(screen.queryByText('Fail')).toBeNull();
        expect(screen.queryByText('Skip')).toBeNull();
      });
    });
  });
});
