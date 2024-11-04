export interface Computation {
  dependencies: Set<Set<Computation>>;
  execute: () => void;
}

export interface MySignal<T> {
  read: () => T;
  write: (v: T) => void;
  // 不需與React hook結合，可以直接移除
  // subscribe: (computation: Computation) => void;
  // unsubscribe: (computation: Computation) => void;
}