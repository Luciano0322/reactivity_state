import { describe, it, expect } from 'vitest';
import { createPrimitiveSignal } from '../src/signal/core';

describe('createPrimitiveSignal', () => {
  it('應該使用初始值創建信號', () => {
    const signal = createPrimitiveSignal(0);
    expect(signal.read()).toBe(0);
  });

  it('當 write 被調用時應該更新值', () => {
    const signal = createPrimitiveSignal(0);
    signal.write(10);
    expect(signal.read()).toBe(10);
  });

});