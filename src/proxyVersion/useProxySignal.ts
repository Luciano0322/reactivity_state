import { useSyncExternalStore } from 'react';
import { ReactiveStore } from './core';

export function useProxySignal<T extends object>(reactiveStore: ReactiveStore<T>): T {
  return useSyncExternalStore(
    reactiveStore.subscribe,
    reactiveStore.getSnapshot,
    reactiveStore.getSnapshot // SSR 支持
  );
}