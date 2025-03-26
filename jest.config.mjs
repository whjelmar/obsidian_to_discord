// jest.config.mjs
export default {
  testEnvironment: "node",
  transform: {},
  testRegex: "(/test/.*|(\\.|/)(test|spec))\\.mjs$",
  coverageDirectory: "./coverage",
  collectCoverageFrom: ["src/**/*.{js,mjs}"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
