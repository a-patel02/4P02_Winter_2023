import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Edit from 'habitforge/components/Edit.tsx';


it('renders the label and text passed as props', () => {
    const label = "Test Label";
    const text = "Test Text";
    render(<Edit label={label} text={text} audioStage={() => {}} />);
  
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  });
  

  describe('Test button click through mocking audioStage function to verify that it is called when button is clicked. ', () => {
    it('calls audioStage function when button is clicked', () => {
        const audioStageMock = jest.fn();
        render(<Edit label="Test Label" text="Test Text" audioStage={audioStageMock} />);
      
        fireEvent.click(screen.getByRole('button'));
        
        expect(audioStageMock).toHaveBeenCalled();
      });    
  })
