module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          // Прямо тут указываем необходимые опции tsconfig для тестов
          jsx: 'react-jsx',
          target: 'ES2020',
          module: 'ESNext',
          esModuleInterop: true,  // рекомендовано для устранения проблем с импортами
          allowSyntheticDefaultImports: true,
          skipLibCheck: true,
          strict: true,
          moduleResolution: 'node',
          // можно добавить другие нужные опции
        },
      },
    ],
  }
};
