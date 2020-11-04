module.exports = {
  verbose: true,
  notify: true,
  testURL: 'http://localhost:3000/',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.ts$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'json', 'js'],
  setupFilesAfterEnv: ['<rootDir>/test/backend/setup.ts'],
  collectCoverageFrom: [
    'src/backend/**/*.ts',
    '!src/backend/cluster.ts',
    '!src/backend/util/*.ts',
    '!src/backend/config.ts',
    '!src/backend/app.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
}
