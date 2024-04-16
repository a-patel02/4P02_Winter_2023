import { renderHook } from '@testing-library/react';
import useSpeechRecognition from 'habitforge/components/useSpeechRecognitionHook.tsx';
import { act } from '@testing-library/react';  

const mockStart = jest.fn();
const mockStop = jest.fn();
const mockOnresult = jest.fn();
const mockOnerror = jest.fn();

global.window.webkitSpeechRecognition = jest.fn(() => ({
  continuous: false,
  lang: '',
  start: mockStart,
  stop: mockStop,
  onresult: mockOnresult,
  onerror: mockOnerror,
}));

describe('useSpeechRecognition hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes correctly', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    expect(result.current.text).toBe("");
    expect(result.current.isListening).toBe(false);
    expect(result.current.hasRecognitionSupport).toBe(true);
  });

  it('starts listening when startListening is called', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => {
      result.current.startListening();
    });
    expect(result.current.isListening).toBe(true);
    expect(mockStart).toHaveBeenCalled();
  });

  it('stops listening when stopListening is called', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => {
      result.current.startListening();  
      result.current.stopListening();
    });
    expect(result.current.isListening).toBe(false);
    expect(mockStop).toHaveBeenCalled();
  });

});
