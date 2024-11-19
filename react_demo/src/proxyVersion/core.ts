export function createProxySignal<T extends object>(initialValue: T): ReactiveStore<T> {
  return new ReactiveStore(initialValue);
}

export class ReactiveStore<T extends object> {
  private state: T;
  private listeners = new Set<() => void>();
  private proxy: T;

  constructor(initialValue: T) {
    this.state = initialValue;
    this.proxy = this.createProxy(this.state);
  }

  // 給 useSyncExternalStore 用來拿取最新快照
  getSnapshot = (): T => {
    return this.proxy;
  };

  // 給 useSyncExternalStore 訂閱狀態變化
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  // 建立代理對象的方法
  private createProxy = (state: T): T => {
    const handler: ProxyHandler<T> = {
      get: (target, prop, receiver) => {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === 'object' && value !== null) {
          return this.createProxy(value as any);
        }
        return value;
      },
      set: (target, prop, value, receiver) => {
        const oldValue = Reflect.get(target, prop, receiver);
        if (oldValue !== value) {
          // 建立新的狀態對象，保證不可變性
          this.state = { ...this.state, [prop]: value } as T;
          // 更新代理對象
          this.proxy = this.createProxy(this.state);
          // 通知所有訂閱者
          this.listeners.forEach((listener) => listener());
        }
        return true;
      },
    };

    return new Proxy(state, handler);
  };
}