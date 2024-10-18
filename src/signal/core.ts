import { Computation, MySignal } from "./types";

export const context: Computation[] = [];

export function subscribe(running: Computation, subscriptions: Set<Computation>): void {
  subscriptions.add(running);
  running.dependencies.add(subscriptions);
}

export function cleanupDependencies(computation: Computation) {
  computation.dependencies.forEach((subscription) => {
    subscription.delete(computation);
  });
  computation.dependencies.clear();
}

// 回傳加了subscribe, unsubscribe 為了方便與 useSyncExternalStore hook 整合

// 通用型信號創建函數，強制要求物件型別
export function createMySignal<T extends object>(initialValue: T): { [K in keyof T]: MySignal<T[K]> } {
  const signals = {} as { [K in keyof T]: MySignal<T[K]> };

  // 使用 Object.keys 來處理屬性
  for (const key of Object.keys(initialValue) as (keyof T)[]) {
    signals[key] = createPrimitiveSignal(initialValue[key]);
  }

  return signals;
}

// 解決物件型別深淺拷貝的問題, 用於處理非物件的單一值
export function createPrimitiveSignal<T>(value: T): MySignal<T> {
  const subscriptions = new Set<Computation>();

  const read = () => {
    const running = context[context.length - 1];
    if (running) subscribe(running, subscriptions);
    return value;
  };

  const write = (nextValue: T) => {
    value = nextValue;
    for (const sub of [...subscriptions]) {
      sub.execute();
    }
  };

  const subscribeToSignal = (computation: Computation) => {
    subscriptions.add(computation);  // 添加訂閱
  };

  const unsubscribeFromSignal = (computation: Computation) => {
    subscriptions.delete(computation);  // 移除訂閱
  };

  return { 
    read, 
    write,
    subscribe: subscribeToSignal,
    unsubscribe: unsubscribeFromSignal,
  };
}

// for 其他框架或是純html, js, css 環境下應用
export function createEffect(fn: () => void) {
  const execute = () => {
    cleanupDependencies(running);
    context.push(running);
    try {
      fn();  // 執行 effect 函數
    } finally {
      context.pop();  // 確保 context 恢復
    }
  };

  const running: Computation = {
    execute,
    dependencies: new Set()
  };

  execute();  // 初次運行 effect
}

// for 其他框架或是純html, js, css 環境下應用
export function createMemo<T>(fn: () => T): () => T {
  let cachedValue: T;
  let firstRun = true;

  const compute = () => {
    cleanupDependencies(running);
    context.push(running);
    try {
      cachedValue = fn();  // 計算結果
    } finally {
      context.pop();  // 確保 context 恢復
    }
  };

  const running: Computation = {
    execute: compute,
    dependencies: new Set()
  };

  return () => {
    if (firstRun) {
      compute();  // 初次運行時計算值
      firstRun = false;
    }
    return cachedValue;  // 返回緩存的結果
  };
}
