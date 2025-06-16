export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/", // ✅ transform axios (and other ESM deps if needed)
  ],
  moduleFileExtensions: ["js", "jsx"],
};
