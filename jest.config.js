module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,

  rootDir: ".",
  testMatch: [
    "<rootDir>/src/**/*.{spec,test}.ts",
  ],

  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/{src,test}/**/*.{spec,test}.ts",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: [
    "text",
    "html",
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
