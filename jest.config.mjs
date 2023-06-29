import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    preset: "ts-jest/presets/js-with-ts",
    transform: {
      "node_modules/variables/.+\\.(j|t)sx?$": ["ts-jest", {tsconfig: '<rootDir>/tests/tsconfig.json'}]
    },
    "transformIgnorePatterns": [
      "node_modules/(?!variables/.*)"
    ],
    rootDir:"./tests",
    testEnvironment: 'jest-environment-jsdom'
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default config;