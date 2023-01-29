export default {
  preset: "ts-jest",
  transform: { "^.+\\.ts?$": "ts-jest" },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  rootDir: "./",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  silent: false,
};
