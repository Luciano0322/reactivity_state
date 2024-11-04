import { describe, it, expect } from 'vitest';
import { context, createEffect, createMemo, createMySignal, createPrimitiveSignal, runInBatch, runWithContext, withContext } from '../src/signal/core';
import { Computation } from '../src/signal/types';

describe('Signal Implementation Tests', () => {
  it('should create a primitive signal with initial value', () => {
    const signal = createPrimitiveSignal(0);
    expect(signal.read()).toBe(0);
  });

  it('should update signal value when write is called', () => {
    const signal = createPrimitiveSignal(0);
    signal.write(10);
    expect(signal.read()).toBe(10);
  });

  it('should trigger computation when signal value changes', () => {
    const signal = createPrimitiveSignal(0);
    let computationExecuted = false;

    const computation = {
      execute: () => {
        computationExecuted = true;
      },
      dependencies: new Set(),
    };

    // 模擬訂閱
    signal.write(0); // 初始化
    signal.write(1); // 值改變，觸發訂閱

    expect(computationExecuted).toBe(false);

    // 透過 effect 來訂閱 signal
    createEffect(() => {
      signal.read(); // 讀取信號，建立依賴
      computationExecuted = true;
    });

    // 重置flag
    computationExecuted = false;
    signal.write(2); // 值改變，應該觸發執行 computation

    expect(computationExecuted).toBe(true);
  });

  it('should support batch updates', () => {
    const signalA = createPrimitiveSignal(0);
    const signalB = createPrimitiveSignal(0);
    let computationCount = 0;

    createEffect(() => {
      signalA.read();
      signalB.read();
      computationCount++;
    });

    expect(computationCount).toBe(1);

    runInBatch(() => {
      signalA.write(1);
      signalB.write(1);
    });

    // 批量更新後，computation 應該只執行一次
    expect(computationCount).toBe(2);
  });

  it('should create memoized values with createMemo', () => {
    const signalA = createPrimitiveSignal(2);
    const signalB = createPrimitiveSignal(3);
    let computationCount = 0;

    const memo = createMemo(() => {
      computationCount++;
      return signalA.read() * signalB.read();
    });

    // 初次執行，應該計算值
    expect(memo()).toBe(6);
    expect(computationCount).toBe(1);

    // 再次調用，依賴為更動，不應該重新計算
    expect(memo()).toBe(6);
    expect(computationCount).toBe(1);

    // 改變依賴
    signalA.write(4);

    // 再次調用，應該重新計算
    expect(memo()).toBe(12);
    expect(computationCount).toBe(2);
  });

  it('should handle async operations with withContext', async () => {
    const signal = createPrimitiveSignal(0);

    let effectExecuted = false;

    createEffect(() => {
      signal.read();
      effectExecuted = true;
    });

    // 初次執行 effect
    expect(effectExecuted).toBe(true);

    // 重置标志
    effectExecuted = false;

    await withContext(async () => {
      // 模拟异步操作
      await new Promise((resolve) => setTimeout(resolve, 10));
      signal.write(1);
    });

    // 异步操作完成后，effect 应该被执行
    expect(effectExecuted).toBe(true);
  });

  it('should correctly manage dependencies in createEffect', () => {
    const signalA = createPrimitiveSignal(0);
    const signalB = createPrimitiveSignal(0);
    let observedValue = 0;
    let effectExecutionCount = 0;

    createEffect(() => {
      effectExecutionCount++;
      if (signalA.read() > 0) {
        observedValue = signalB.read();
      }
    });

    expect(effectExecutionCount).toBe(1);
    expect(observedValue).toBe(0);

    // 改变 signalB，不应触发 effect，因为未依赖
    signalB.write(1);
    expect(effectExecutionCount).toBe(1);

    // 改变 signalA，effect 应该执行并读取 signalB
    signalA.write(1);
    expect(effectExecutionCount).toBe(2);
    expect(observedValue).toBe(1);

    // 再次改变 signalB，现在 effect 已经依赖于 signalB，应触发 effect
    signalB.write(2);
    expect(effectExecutionCount).toBe(3);
    expect(observedValue).toBe(2);
  });

  it('should clean up dependencies correctly', () => {
    const signalA = createPrimitiveSignal(0);
    const signalB = createPrimitiveSignal(0);
    let effectExecutionCount = 0;

    createEffect(() => {
      effectExecutionCount++;
      if (signalA.read() > 0) {
        signalB.read();
      }
    });

    expect(effectExecutionCount).toBe(1);

    // 改变 signalB，不应触发 effect，因为未依赖
    signalB.write(1);
    expect(effectExecutionCount).toBe(1);

    // 改变 signalA，effect 应该执行并建立对 signalB 的依赖
    signalA.write(1);
    expect(effectExecutionCount).toBe(2);

    // 再次改变 signalB，effect 应该执行
    signalB.write(2);
    expect(effectExecutionCount).toBe(3);

    // 将 signalA 改回 0，effect 不再依赖于 signalB
    signalA.write(0);
    expect(effectExecutionCount).toBe(4);

    // 改变 signalB，不应再触发 effect
    signalB.write(3);
    expect(effectExecutionCount).toBe(4);
  });

  it('should handle object signals created by createMySignal', () => {
    const initialValue = { count: 0, name: 'Test' };
    const signals = createMySignal(initialValue);

    // 检查返回的信号对象
    expect(signals.count.read()).toBe(0);
    expect(signals.name.read()).toBe('Test');

    // 更新信号值
    signals.count.write(10);
    signals.name.write('Updated');

    expect(signals.count.read()).toBe(10);
    expect(signals.name.read()).toBe('Updated');
  });

  it('should support nested signals in createSignalObject', () => {
    const initialValue = { nested: { count: 0 } };
    const signals = createMySignal(initialValue);

    expect(signals.nested.count.read()).toBe(0);

    signals.nested.count.write(5);

    expect(signals.nested.count.read()).toBe(5);
  });

  it('should execute computations in correct context', () => {
    const signal = createPrimitiveSignal(0);
    let contextValue: Computation | undefined;
    let effectComputation: Computation | undefined;

    // 创建 effect，并在其中访问 context
    createEffect(() => {
      effectComputation = context[context.length - 1]; // 获取当前的 computation

      // 修改 effectComputation.execute
      effectComputation!.execute = () => {
        runWithContext(effectComputation!, () => {
          contextValue = context[context.length - 1];
        });
      };

      signal.read(); // 建立依赖
    });

    // 初次执行后，effectComputation 应该已被设置
    expect(effectComputation).not.toBeUndefined();

    // 触发 signal 更新，effect 将被重新执行
    signal.write(1);

    // 检查 contextValue 是否等于 effectComputation
    expect(contextValue).toBe(effectComputation);
  });

  it('should prevent infinite loops in effects', () => {
    const signal = createPrimitiveSignal(0);
    let executionCount = 0;

    createEffect(() => {
      executionCount++;
      const value = signal.read();
      if (value < 5) {
        signal.write(value + 1);
      }
    });

    // 由于条件限制，effect 应该只执行 6 次（包括初始执行）
    expect(executionCount).toBe(6);
    expect(signal.read()).toBe(5);
  });
});
