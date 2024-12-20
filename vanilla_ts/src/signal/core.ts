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

// 判斷是否為物件類型
function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// 通用型信號創建函數，判斷是否為物件型別
export function createMySignal<T>(initialValue: T): SignalType<T> {
  if(Array.isArray(initialValue)) {
    return createPrimitiveSignal(initialValue) as SignalType<T>;
  } else if (isObject(initialValue)) {
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

export function createPrimitiveSignal<T>(initialValue: T): MySignal<T> {
  const subscriptions = new Set<Computation>();
  let value = initialValue;

  const read = () => {
    const running = context[context.length - 1];
    if (running) subscribe(running, subscriptions);
    return value;
  };
  // 新增可以帶入callback取前值的方式修改
  const write = (nextValue: T | ((prevValue: T) => T)) => {
    const newValue = typeof nextValue === 'function'
      ? (nextValue as (prevValue: T) => T)(value)
      : nextValue;

    if (newValue !== value) {
      value = newValue;
      for (const sub of [...subscriptions]) {
        // scheduleUpdate(sub);
        // 調整成符合push-pull
        if(!sub.dirty) {
          sub.dirty = true; // 標記訂閱者為需要更新
          scheduleComputation(sub);
        }
      }
    }
  };

  return { 
    read, 
    write,
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

// for 純html, js, css 環境下應用, 調整以符合 async 情境的處理
export function createEffect(fn: () => void) {
  const running: Computation = {
    execute: () => {
      // 調整符合push-pull
      if (!running.dirty) return; // 如果不需要更新，直接返回
      running.dirty = false; // 重置標記
      cleanupDependencies(running);
      runWithContext(running, fn);
    },
    dependencies: new Set(),
    dirty: true, // 設定初始狀態為需要更新，確保第一次執行
  };
  // running.execute();  // 初次運行 effect
  // 調整符合push-pull，不再立即執行 running.execute();
  // 改為需要時執行
  scheduleComputation(running);
}

// for 純html, js, css 環境下應用, 調整以符合 async 情境的處理
export function createMemo<T>(fn: () => T): () => T {
  // 修改以符合push-pull
  // let cachedValue: T;
  // let firstRun = true;

  const running: Computation = {
    execute: () => {
      // 修改以符合push-pull
      if (!running.dirty) return;
      running.dirty = false;
      cleanupDependencies(running);
      running.value = runWithContext(running, fn);
    },
    dependencies: new Set(),
    dirty: true,
    value: undefined,
  };

  // return () => {
  //   if (firstRun) {
  //     running.execute();  // 初次運行時計算值
  //     firstRun = false;
  //   }
  //   return cachedValue;  // 返回緩存的結果
  // };
  // 修改以符合push-pull
  return () => {
    if (running.dirty) {
      running.execute();
    }
    return running.value as T;
  };
}

// 修改以符合push-pull，新增任務調度制度
const dirtyComputations = new Set<Computation>();
let isFlushing = false;

function scheduleComputation(computation: Computation) {
  dirtyComputations.add(computation);

  if (!isFlushing) {
    isFlushing = true;
    queueMicrotask(flushComputations);
  }
}

function flushComputations() {
  for (const computation of dirtyComputations) {
    computation.execute();
  }
  dirtyComputations.clear();
  isFlushing = false;
}
