export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node', 'mts'],
  collectCoverageFrom: [
    'src/**/*.{ts,js,mts}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/loadEnv.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  transform: {
    '^.+\\.(ts|mts)$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.json'
    }]
  },
  extensionsToTreatAsEsm: ['.ts', '.mts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  setupFiles: ['<rootDir>/src/__tests__/setup.mts']
}; 