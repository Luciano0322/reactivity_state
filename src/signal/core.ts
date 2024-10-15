import { Computation } from "./types";

export const context: Computation[] = [];

function subscribe(running: Computation, subscriptions: Set<Computation>): void {
  subscriptions.add(running);
  running.dependencies.add(subscriptions);
}

export function createMySignal<T>(value: T): {
  read: () => T;
  write: (v: T) => void;
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
  return { read, write };
}