import { useEffect, useState } from "react";

type SpeechRecognitionType = any | null;

const useSpeechRecognition = () => {
  const [text, setText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hasRecognitionSupport, setHasRecognitionSupport] =
    useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionType>(null);
// adding button indicator

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const webkitSpeechRecognition: any = (window as any)
        .webkitSpeechRecognition;
      const recognitionInstance = new webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.lang = "en-US";
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        setText(transcript);
        setIsListening(false);
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
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  };
};

export default useSpeechRecognition;
