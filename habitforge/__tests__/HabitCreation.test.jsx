// import '@testing-library/jest-dom'
// import { render, screen } from '@testing-library/react'
// import FirstHabit from 'habitforge/components/Dashboard/FirstHabit.tsx'

// // Mock the Firebase messaging module
// jest.mock('firebase/messaging', () => ({
//   getMessaging: jest.fn(() => ({
//     getToken: jest.fn(() => Promise.resolve('mocked-token')),
//   })),
// }));

// // Mock the Firebase app module
// jest.mock('firebase/app', () => ({
//   __esModule: true,
//   default: {
//     initializeApp: jest.fn(),
//     auth: jest.fn(),
//     firestore: jest.fn(),
//   },
// }));

// jest.mock('firebase/firestore', () => ({
//   doc: jest.fn(),
//   updateDoc: jest.fn(() => Promise.resolve()),
//   deleteDoc: jest.fn(() => Promise.resolve()),
//   serverTimestamp: jest.fn(),
// }));

// jest.mock('@/firebase/firebase', () => ({
//   db: {},
// }));

// jest.mock('sonner', () => ({
//   toast: {
//     info: jest.fn(),
//   },
// }));
// jest.mock('firebase/firestore', () => ({
//   collection: jest.fn().mockReturnThis(),
//   doc: jest.fn().mockReturnThis(),
//   updateDoc: jest.fn(),
//   deleteDoc: jest.fn(),
//   setDoc: jest.fn(),
//   serverTimestamp: jest.fn()
// }));


// describe('FirstHabit Component', () => {

// });