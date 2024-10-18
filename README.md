# Fine-Grained Reactivity State
做這個主題主要是想實踐一個 React 環境下的 Reactivity State Management, 也就是真正意義上的 Signal, 請務必先閱讀下面兩篇文章。  
[Introduction to Fine-Grained Reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf)  
[Building a Reactive Library from Scratch](https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p)  
我所做的研究是實踐上述提供的作法並與 React 環境下結合，這邊要讓大家先了解 signal pattern 與 observer pattern 之間些微的差異：  
| 特性 | 	Signal	| Observer Pattern |
| --- | --- | --- |
| 依賴管理	| 自動追蹤依賴，細粒度更新	| 不關注依賴，訂閱者全局接收更新通知| 
| 變更通知範圍	| 精確通知直接依賴的部分	| 所有訂閱者都會收到變更通知| 
| 設計目標	| 高效、細粒度的狀態管理與 UI 更新	| 廣播式通知，適合鬆耦合系統或事件驅動系統| 
| 更新模式	| 同步，變化即時觸發依賴更新	| 異步或同步，視具體實現而定| 
| 使用場景	| 前端框架中的狀態管理（如 Solid.js, Svelte）	| 系統級事件處理、事件總線、數據流管理等|   

有了以上基礎認知後，也參考了 preact signal 的作法，當然 solid js 提供的實踐方式會比使用 Proxy 操作 signal 來的效能好，但基於我自己求知的好奇心，還是有處理 Proxy 實作的部分，但得知後續效能的考量，就沒繼續往下寫了。

## Rsbuild Project default with biome  
也是這個原因所以在使用preact signal 必須加上useSignals(), 如果是採用 babel 則不需要加這行，可以在 babel config 裡面設定 plugin, 讓使用過程更加順暢

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
