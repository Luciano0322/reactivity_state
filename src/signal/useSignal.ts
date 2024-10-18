import { useState, useEffect, useSyncExternalStore } from 'react';
import { Computation, MySignal } from './types';
import { cleanupDependencies, context, subscribe } from './core';

// 傳統與state綁定，參考jotai useAtom作法
export function useMySignalv1<T>(
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
// 改使用useSyncExternalStore處理
export function useMySignalv2<T>(
  signal: { read: () => T; write: (v: T) => void }
) {
  return useSyncExternalStore(
    (onStoreChange) => {
      // 自定義的 Computation 中的 execute 方法應該觸發這個回調
      const subscription = {
        execute: onStoreChange,
        dependencies: new Set<Set<Computation>>(),
      };

      // 將該訂閱加入到 context 中
      context.push(subscription);

      // 返回取消訂閱的方法
      return () => {
        // 移除訂閱
        context.splice(context.indexOf(subscription), 1);
      };
    },
    // 返回當前的 signal 值
    () => signal.read(),

    // 伺服器端渲染快照：如果有伺服器渲染需求，可使用此方法來獲取伺服器端的值
    () => signal.read()
  )
}

// 更接近solid js設計的signal
export function useMySignal<T>(signal: MySignal<T>) {
  // 使用 useSyncExternalStore 來同步外部信號變化
  const value = useSyncExternalStore(
    (onStoreChange) => {
      // 這裡會自動訂閱 signal
      const computation: Computation = {
        execute: onStoreChange,        // 當信號變化時觸發
        dependencies: new Set()        // 用於追蹤依賴
      };
      signal.subscribe(computation);  // 訂閱信號
      return () => signal.unsubscribe(computation);
    },
    () => signal.read(),
    // 伺服器端渲染快照：如果有伺服器渲染需求，可使用此方法來獲取伺服器端的值
    () => signal.read()
  );

  return value; // 返回信號的最新值
}
