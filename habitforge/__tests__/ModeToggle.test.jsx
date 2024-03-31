import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from 'habitforge/components/ModeToggle.tsx';
import { Moon, Sun } from "lucide-react";


jest.mock('next-themes', () => ({
    useTheme: () => ({
      setTheme: jest.fn(),
    }),
  }));
  
  describe('ModeToggle', () => {
    it('renders ModeToggle component', () => {
      render(<ModeToggle />);
      const modeToggleElement = screen.getByRole('button', { name: 'Toggle theme' });
      expect(modeToggleElement).toBeInTheDocument();
    });
  
    it('displays correct icon based on theme', () => {
      render(<ModeToggle />);
      const sunIcon = screen.getByTestId('sun-icon');
      const moonIcon = screen.getByTestId('moon-icon');
      expect(sunIcon).toHaveClass('rotate-0 scale-100');
      expect(moonIcon).toHaveClass('rotate-90 scale-0');
    });
  
    // it('toggles theme to light when Light option is clicked', () => {
    //   render(<ModeToggle />);
    //   const lightOption = screen.getByRole('menuitem', { name: 'Light' });
    //   fireEvent.click(lightOption);
    //   expect(setTheme).toHaveBeenCalledWith('light');
    // });
  
    // it('toggles theme to dark when Dark option is clicked', () => {
    //   render(<ModeToggle />);
    //   const darkOption = screen.getByRole('menuitem', { name: 'Dark' });
    //   fireEvent.click(darkOption);
    //   expect(setTheme).toHaveBeenCalledWith('dark');
    // });
  
    // it('toggles theme to system default when System option is clicked', () => {
    //   render(<ModeToggle />);
    //   const systemOption = screen.getByRole('menuitem', { name: 'System' });
    //   fireEvent.click(systemOption);
    //   expect(setTheme).toHaveBeenCalledWith('system');
    // });
  });