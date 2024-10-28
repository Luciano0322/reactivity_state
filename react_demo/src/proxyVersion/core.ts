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

  // 用于 useSyncExternalStore 获取最新快照
  getSnapshot = (): T => {
    return this.proxy;
  };

  // 用于 useSyncExternalStore 订阅状态变化
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  // 创建代理对象的方法
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
          // 创建新的状态对象，保证不可变性
          this.state = { ...this.state, [prop]: value } as T;
          // 更新代理对象
          this.proxy = this.createProxy(this.state);
          // 通知所有订阅者
          this.listeners.forEach((listener) => listener());
        }
        return true;
      },
    };

    return new Proxy(state, handler);
  };
}