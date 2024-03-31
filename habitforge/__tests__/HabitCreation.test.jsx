import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import FirstHabit from 'habitforge/components/Dashboard/FirstHabit.tsx'

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false, // You can set this to true or false depending on what you want to test
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  

describe('Create your first habit', () => {
    it('renders the page and checks if atleast one habit is created', () => {
      render(< FirstHabit />);
      const headingElement = screen.getByText(/create your first habit/i, { exact: false });

      expect(headingElement).toBeInTheDocument();
    });
    it('renders the motivational text correctly', () => {
        render(<FirstHabit />);
        const motivationalText = screen.getByText(/one habit at a time you can accomplish any goal you set out too!/i, { exact: false });
        expect(motivationalText).toBeInTheDocument();
      });
  });