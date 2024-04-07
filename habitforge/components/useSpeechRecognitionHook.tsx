import { useEffect, useRef, useState } from "react";

type SpeechRecognitionType = any | null;

const useSpeechRecognition = () => {
  const [text, setText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionType>(null);
  const silenceTimer = useRef<number | null>(null); 

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition: any = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.lang = "en-US";
      recognitionInstance.onresult = (event: any) => {
        if (silenceTimer.current) {
          clearTimeout(silenceTimer.current);
        }
        const transcript = event.results[event.resultIndex][0].transcript;
        setText(transcript);
        setIsListening(false);

        silenceTimer.current = window.setTimeout(() => { 
          stopListening();
          console.log("Stopped listening since user didn't talk for 10 seconds");
        }, 10000);
      };
      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
      setRecognition(recognitionInstance);
      setHasRecognitionSupport(true);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setText("");
      setIsListening(true);
      recognition.start();
      // Set the silence timer when the listening starts
      silenceTimer.current = window.setTimeout(() => { 
        stopListening();
        console.log("Stopped listening since user didn't talk for 10 seconds");
      }, 10000);
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
      }
    }
  };

  // Cleanup function to stop recognition and clear timeout when the component unmounts or the recognition stops
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }
    };
  }, [recognition]);

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  };
};

export default useSpeechRecognition;
