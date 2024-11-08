import { useState, useEffect, useSyncExternalStore } from 'react';
import { Computation, MySignal } from './types';
import { cleanupDependencies, context, runWithContext, scheduleComputation, subscribe, withContext } from './core';

// 傳統與state綁定，參考jotai useAtom作法
export function useMySignalv1<T>(
  signal: { read: () => T; write: (value: T | ((prevValue: T) => T)) => void; }
): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(signal.read());

  useEffect(() => {
    const computation: Computation = {
      dependencies: new Set(),
      // 對應文章中的createEffect
      execute() {
        if (!computation.dirty) return; // 如果不需要更新，直接返回
        computation.dirty = false; // 重置標記
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
      dirty: true,
    };

    // 初次執行
    // computation.execute();
    scheduleComputation(computation);
    // 清理依賴
    return () => {
      cleanupDependencies(computation)
    };
  }, [signal]);

  // 新增setter直接寫入signal
  const setSignal = (newValue: T) => {
    signal.write(newValue);
  };

  return [value, setSignal];
}

// 更接近solid js設計的signal
export function useMySignal<T>(signal: MySignal<T>) {
  // 使用 useSyncExternalStore 來同步外部信號變化
  const value = useSyncExternalStore(
    (onStoreChange) => {
      // 這裡會自動訂閱 signal
      // const computation: Computation = {
      //   execute: onStoreChange,        // 當信號變化時觸發
      //   dependencies: new Set()        // 用於追蹤依賴
      // };
      // signal.subscribe(computation);  // 訂閱信號
      // return () => signal.unsubscribe(computation);
      // 調整以符合 push-pull
      return signal.subscribe(onStoreChange)
    },
    () => signal.read(),
    // 伺服器端渲染快照：如果有伺服器渲染需求，可使用此方法來獲取伺服器端的值
    () => signal.read()
  );

  return value; // 返回信號的最新值
}

// 新增 Effect in React 環境, 其實就是將原本的 createEffect 改用 useEffect 額外封包
// dependencies 必須符合 useEffect 的規範
export function useMySignalEffect(fn: () => void, dependencies: any[]) {
  useEffect(() => {
    // const execute = () => {
    //   cleanupDependencies(running);
    //   context.push(running);
    //   try {
    //     fn();
    //   } finally {
    //     context.pop();
    //   }
    // };

    // const running: Computation = {
    //   execute,
    //   dependencies: new Set(),
    // };
    // 調整以符合 push-pull
    const running: Computation = {
      execute: () => {
        if (!running.dirty) return;
        running.dirty = false;
        cleanupDependencies(running);
        runWithContext(running, fn);
      },
      dependencies: new Set(),
      dirty: true,
    };

    // execute();
    // 調整以符合 push-pull, 初次調用
    scheduleComputation(running);

    // Cleanup when dependencies change or component unmounts
    return () => {
      cleanupDependencies(running);
    };
  }, dependencies);
}

export function useMySignalAsyncEffect(effect: () => Promise<void>, dependencies: any[]) {
  useEffect(() => {
    // const running: Computation = {
    //   execute: () => {
    //     cleanupDependencies(running);
    //   },
    //   dependencies: new Set(),
    // };

    // withContext(effect);
    // 調整以符合 push-pull
    const running: Computation = {
      execute: async () => {
        if (!running.dirty) return;
        running.dirty = false;
        cleanupDependencies(running);
        await withContext(effect);
      },
      dependencies: new Set(),
      dirty: true,
    };

    // 调度计算
    scheduleComputation(running);

    return () => {
      cleanupDependencies(running);
    };
  }, dependencies);
}
