// // speech-recognition.d.ts

// // Check if the global types do not already include `SpeechRecognition` before declaring.
// declare global {
//     interface Window {
//       webkitSpeechRecognition: typeof SpeechRecognition;
//     }
    
//     interface SpeechRecognition extends EventTarget {
//       new(): SpeechRecognition;
//       continuous: boolean;
//       lang: string;
//       interimResults: boolean;
//       maxAlternatives: number;
//       start(): void;
//       stop(): void;
//       onresult: (event: SpeechRecognitionEvent) => void;
//       onerror: (event: SpeechRecognitionError) => void;
//       // ... add other properties and methods you need
//     }
  
//     interface SpeechRecognitionEvent extends Event {
//       results: SpeechRecognitionResultList;
//       resultIndex: number;
//       // ... add other properties you need
//     }
  
//     interface SpeechRecognitionResultList {
//       length: number;
//       item(index: number): SpeechRecognitionResult;
//       [index: number]: SpeechRecognitionResult;
//     }
  
//     interface SpeechRecognitionResult {
//       isFinal: boolean;
//       [index: number]: SpeechRecognitionAlternative;
//     }
  
//     interface SpeechRecognitionAlternative {
//       transcript: string;
//       confidence: number;
//     }
  
//     interface SpeechRecognitionError extends Event {
//       error: string;
//       message: string;
//       // ... add other properties you need
//     }
//   }
  
//   // If you need to access webkitSpeechRecognition on the window object,
//   // you might need to declare it separately:
//   declare var webkitSpeechRecognition: typeof SpeechRecognition;
  
//   export {};
  