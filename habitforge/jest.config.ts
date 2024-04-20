import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './', 
});

const customJestConfig: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  moduleNameMapper: {
  //points to  firebase moduel
    '^@/firebase/firebase$': '<rootDir>/firebase/firebase.ts',
  },
};

export default createJestConfig(customJestConfig);
