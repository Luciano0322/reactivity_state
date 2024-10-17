import { Computation } from "./types";

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

export function createMySignal<T>(value: T): {
  read: () => T;
  write: (v: T) => void;
  subscribe: (computation: Computation) => void;
  unsubscribe: (computation: Computation) => void;
} {
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
