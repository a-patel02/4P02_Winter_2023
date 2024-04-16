import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Podium from 'habitforge/components/Leaderboards/Podium.tsx';


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
  jest.mock('firebase/firestore', () => ({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    setDoc: jest.fn(),
    serverTimestamp: jest.fn()
  }));
describe('Podium Component', () => {
  const mockProps = {
    level: 1,
    name: 'Ameen',
    rank: 1,
    photoURL: 'https://example.com/photo.jpg'
  };

  it('renders correctly with a gold medal for level 1', () => {
    render(<Podium {...mockProps} />);
    expect(screen.getByAltText('Gold')).toBeInTheDocument();
    expect(screen.getByText('Ameen')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Checking rank display
  });

  it('renders correctly with a silver medal for level 2', () => {
    render(<Podium {...{ ...mockProps, level: 2 }} />);
    expect(screen.getByAltText('Silver')).toBeInTheDocument();
    expect(screen.getByText('Ameen')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Checking rank display
  });

  it('renders correctly with a bronze medal for level 3', () => {
    render(<Podium {...{ ...mockProps, level: 3 }} />);
    expect(screen.getByAltText('Bronze')).toBeInTheDocument();
    expect(screen.getByText('Ameen')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Checking rank display
  });

  it('renders without a medal for level other than 1, 2, or 3', () => {
    render(<Podium {...{ ...mockProps, level: 4 }} />);
    expect(screen.queryByAltText('Gold')).toBeNull();
    expect(screen.queryByAltText('Silver')).toBeNull();
    expect(screen.queryByAltText('Bronze')).toBeNull();
    expect(screen.getByText('Ameen')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Checking rank display
  });

});


describe('Podium Component', () => {
    const baseProps = {
      level: 2,
      name: 'Ameen',
      rank: 1,
      photoURL: 'https://example.com/photo.jpg',
    };
  
    it('displays the correct rank', () => {
      render(<Podium {...baseProps} />);
      expect(screen.getByText(baseProps.rank)).toBeInTheDocument();
    });
  
    it('displays the correct name', () => {
      render(<Podium {...baseProps} />);
      expect(screen.getByText(baseProps.name)).toBeInTheDocument();
    });
  
    it('correctly renders the user photo', () => {
      render(<Podium {...baseProps} />);
      const img = screen.getByAltText('User');
      expect(img).toHaveAttribute('src', baseProps.photoURL);
    });
  

  
    it('does not render a medal image for levels other than 1, 2, or 3', () => {
      render(<Podium {...baseProps} level={4} />);
      expect(screen.queryByAltText('Gold')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Silver')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Bronze')).not.toBeInTheDocument();
    });
  
    it('ensures all images have appropriate alt text for accessibility', () => {
      render(<Podium {...baseProps} level={1} />);
      const goldMedalImage = screen.getByAltText('Gold');
      expect(goldMedalImage).toBeInTheDocument();
    });
  
    it('renders correctly with minimal props', () => {
      const minimalProps = { level: 1, name: 'Jane Doe', rank: 2, photoURL: 'https://example.com/photo.jpg' };
      render(<Podium {...minimalProps} />);
      expect(screen.getByText(minimalProps.name)).toBeInTheDocument();
      expect(screen.getByText(minimalProps.rank)).toBeInTheDocument();
      const userImage = screen.getByAltText('User');
      expect(userImage).toHaveAttribute('src', minimalProps.photoURL);
    });
  });