import { Computation, MySignal, SignalObject, SignalType } from "./types";

export const context: Computation[] = [];

// 批量更新相關的全域變數
let batching = false;
const pendingComputations = new Set<Computation>();

// 開始批量更新
export function startBatch() {
  batching = true;
}

// 結束批量更新
export function endBatch() {
  batching = false;
  const computations = Array.from(pendingComputations);
  pendingComputations.clear();
  // 這裡是以考量符合 React 環境下使用的，如果是其他框架這邊要去查各自的批量更新方法
  // unstable_batchedUpdates(() => {
  //   computations.forEach((comp) => comp.execute());
  // });
  computations.forEach((comp) => comp.execute());
}

// 運行批量更新
export function runInBatch(fn: () => void) {
  startBatch();
  try {
    fn();
  } finally {
    endBatch();
  }
}

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
// 判斷是否為物件類型
function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null;
}

// export function createMySignal<T extends object>(initialValue: T): SignalObject<T>;
// export function createMySignal<T>(initialValue: T): MySignal<T>;

// 通用型信號創建函數，判斷是否為物件型別
export function createMySignal<T>(initialValue: T): SignalType<T> {
  if (isObject(initialValue)) {
    return createSignalObject(initialValue as any) as SignalType<T>;
  } else {
    return createPrimitiveSignal(initialValue) as SignalType<T>;
  }
}

// 解決物件型別深淺拷貝的問題, 用於處理非物件的單一值
export function createSignalObject<T extends object>(initialValue: T): SignalObject<T> {
  const signals = {} as SignalObject<T>;

  for (const key in initialValue) {
    if (Object.prototype.hasOwnProperty.call(initialValue, key)) {
      const typedKey = key as keyof T;
      const value = initialValue[typedKey];
      signals[typedKey] = createMySignal(value) as SignalType<T[typeof typedKey]>;
    }
  }

  return signals;
}

// 調整以符合 react 的 batch update
function scheduleUpdate(computation: Computation) {
  if (batching) {
    pendingComputations.add(computation);
  } else {
    computation.execute();
  }
}

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
      // sub.execute(); 
      scheduleUpdate(sub);
    }
  };
  // 不需要與React 融合的情況下不需要回傳，避免開發者誤用
  // const subscribeToSignal = (computation: Computation) => {
  //   subscriptions.add(computation);  // 添加訂閱
  // };

  // const unsubscribeFromSignal = (computation: Computation) => {
  //   subscriptions.delete(computation);  // 移除訂閱
  // };

  return { 
    read, 
    write,
    // subscribe: subscribeToSignal,
    // unsubscribe: unsubscribeFromSignal,
  };
}

// 思考以符合 async 處理的情境，在異步狀態下也能保持正確的傳遞
export function runWithContext<T>(computation: Computation, fn: () => T): T {
  context.push(computation);
  try {
    return fn(); // 執行 effect 函數
  } finally {
    context.pop(); // 確保 context 恢復
  }
}

// 優化 context 的傳遞順序
/**
 * function withContext 
 * 使用範例：在 createEffect 中使用 async
 * createEffect(() => {
 *    withContext(async () => {
 *      const data = await fetchData();
 *      dataSignal.write(data);
 *    });
 * });
 */

export function withContext<T>(fn: () => Promise<T>): Promise<T> {
  const running = context[context.length - 1];
  return fn().then((result) => {
    return runWithContext(running, () => result);
  });
}

// for 其他框架或是純html, js, css 環境下應用, 調整以符合 async 情境的處理
export function createEffect(fn: () => void) {
  const running: Computation = {
    execute: () => {
      cleanupDependencies(running);
      runWithContext(running, fn);
    },
    dependencies: new Set(),
  };

  running.execute();  // 初次運行 effect
}

// for 其他框架或是純html, js, css 環境下應用, 調整以符合 async 情境的處理
export function createMemo<T>(fn: () => T): () => T {
  let cachedValue: T;
  let firstRun = true;

  const running: Computation = {
    execute: () => {
      cleanupDependencies(running);
      cachedValue = runWithContext(running, fn);
    },
    dependencies: new Set(),
  };

  return () => {
    if (firstRun) {
      running.execute();  // 初次運行時計算值
      firstRun = false;
    }
    return cachedValue;  // 返回緩存的結果
  };
}
