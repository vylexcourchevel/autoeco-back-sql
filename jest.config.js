export default {
    testEnvironment: 'node',
    transform: {},
    moduleNameMapper: {
      // This helps with resolving module paths
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
  };
  