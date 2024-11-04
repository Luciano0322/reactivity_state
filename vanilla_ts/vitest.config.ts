import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,       // 支持全局的 describe, it 等
    environment: 'node', // 指定測試環境
    coverage: {
      reporter: ['text', 'lcov'], // 設置測試覆蓋率報告格式
      exclude: ['node_modules/', 'tests/'],
    },
  },
});