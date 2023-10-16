module.exports = {
	clearMocks: true,
	coverageProvider: 'v8',
	moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
	roots: ['<rootDir>/src'],
	testMatch: ["<rootDir>/src/__tests__/**/*.test.ts"],
	transform: {
	  '^.+\\.(ts|tsx)$': 'ts-jest',
	},
  };
  