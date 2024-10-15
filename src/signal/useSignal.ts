import { useState, useEffect } from 'react';
import { Computation } from './types';
import { context } from './core';

export function useSignal<T>(
  signal: { read: () => T; write: (v: T) => void }
): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(signal.read());

  useEffect(() => {
    const computation: Computation = {
      dependencies: new Set(),
      // 對應文章中的createEffect
      execute() {
        // 對應文章中的clean up function
        for (const dep of computation.dependencies) {
          dep.delete(computation);
        }
        computation.dependencies.clear();
        // 利用 stack 特性推入
        context.push(computation);
        try {
          const newValue = signal.read();
          setValue(newValue);
        } finally {
          // 利用 stack 特性拿出
          context.pop();
        }
      },
    };

    // 初次執行
    computation.execute();

    // 清理依賴
    return () => {
      for (const dep of computation.dependencies) {
        dep.delete(computation);
      }
      computation.dependencies.clear();
    };
  }, [signal]);

  // 新增setter直接寫入signal
  const setSignal = (newValue: T) => {
    signal.write(newValue);
  };

  return [value, setSignal];
}