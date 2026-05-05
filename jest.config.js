module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: {
        module: "commonjs"
      }
    }]
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(chess.js)/)"  
  ]
};