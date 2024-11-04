export interface Computation {
  dependencies: Set<Set<Computation>>;
  execute: () => void;
}

export interface MySignal<T> {
  read: () => T;
  write: (value: T | ((prevValue: T) => T)) => void;
  subscribe: (computation: Computation) => void;
  unsubscribe: (computation: Computation) => void;
}

export type SignalType<T> = T extends any[]
? MySignal<T> // 當 T 是array時，返回 MySignal<T>
: T extends object
  ? SignalObject<T> // 當 T 是物件（但不是array）時，返回 SignalObject<T>
  : MySignal<T>;    // 其他情況，返回 MySignal<T>

export type SignalObject<T extends object> = {
  [K in keyof T]: SignalType<T[K]>;
};
