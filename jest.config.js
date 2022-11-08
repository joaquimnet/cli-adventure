// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  collectCoverage: true,
  coverageDirectory: path.join(__dirname, 'coverage'),
};
