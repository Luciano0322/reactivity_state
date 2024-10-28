# Rsbuild Project default with biome  
也是這個原因所以在使用preact signal 必須加上useSignals(), 如果是採用 babel 則不需要加這行，可以在 babel config 裡面設定 plugin, 讓使用過程更加順暢。  

## 核心概念

在開始之前，我們需要了解以下幾個核心概念：  
- Signal (信號): 表示一個可以變動的值，要有讀取（read）和寫入（write）。  
- Computation（計算處理）：表示一個計算過程，可能依賴於一個或多個 Signal，當依賴的 Signal 發生變化時，Computation 會重新執行計算。  
- Dependency Tracking（依賴追蹤）：用來記錄 Computation 與 Signal 之間的依賴關係，當 Signal 發生變化，通知相關的 Computation。  

### Setup

Install the dependencies:

```bash
pnpm install
```

### Get Started

Start the dev server:

```bash
pnpm dev
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```
