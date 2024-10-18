export interface Computation {
  dependencies: Set<Set<Computation>>;
  execute: () => void;
}

export interface MySignal<T> {
  read: () => T;
  write: (v: T) => void;
  subscribe: (computation: Computation) => void;
  unsubscribe: (computation: Computation) => void;
}