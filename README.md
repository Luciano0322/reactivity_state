# Fine-Grained Reactivity State
做這個主題主要是想實踐一個 React 環境下的 Reactivity State Management, 也就是真正意義上的 Signal, 請務必先閱讀下面兩篇文章。  
[Introduction to Fine-Grained Reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf)  
[Building a Reactive Library from Scratch](https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p)  
我所做的研究是實踐上述提供的作法並與 React 環境下結合，這邊要讓大家先了解 signal pattern 與 observer pattern 之間些微的差異：  
1. 概念與範疇  

  - Signal:  
    - 信號 是一種 細粒度反應式 狀態管理模型，專注於 狀態的追蹤與依賴。  

	  -	信號不僅僅是訂閱者和發布者之間的關係，它能夠精確地追蹤哪個變量依賴於哪個信號，並在變化時只更新依賴該信號的部分。這是一種反應式系統，通常在 Fine-Grained Reactivity 機制中使用。  

	  -	信號管理的更核心的特性是其 同步性 和 依賴的自動追蹤。當信號變化時，依賴信號的所有計算或組件都會自動更新。  

	-	Observer Pattern:  

	  -	觀察者模式 是一種典型的 設計模式，用於 訂閱者與發布者 之間的關係。觀察者模式中的主體會向訂閱者發送通知，告知它們狀態發生了變化。  

	  -	觀察者模式並不關注細粒度的依賴追蹤，它更像是一個廣播系統：當某個事件發生時，所有訂閱這個事件的觀察者都會被通知。  

	  -	觀察者模式的設計目的是為了讓多個觀察者能夠關注某個對象的狀態變更，並能夠自動反應。  


2. 依賴追蹤 vs 廣播通知  

	-	Signal:  

	  -	在 信號系統 中，依賴關係是自動追蹤的，並且這些依賴是 細粒度 的。信號可以精確知道哪些地方依賴於它，並且只通知那些直接依賴它的部分進行更新。  

	  -	這種依賴追蹤能確保信號變更時只觸發必要的更新，從而減少不必要的重新渲染或計算。  

	-	Observer Pattern:  

	  -	在 觀察者模式 中，當主體狀態改變時，它會向 所有訂閱者 廣播通知。這種方式更適合廣播類事件系統，但它並不會自動知道哪些觀察者真的需要這個變更。  

	  -	這意味著即使某些訂閱者不需要該變更，也可能會收到通知，這樣可能會引起不必要的處理和開銷。  


3. 細粒度反應性 vs 粗粒度更新  

	-	Signal:  

	  -	信號系統專注於 細粒度的反應性。每個信號變化時，依賴於這個信號的部分可以立即更新，而不會觸發不相關的部分。  

	  -	這種設計非常適合像 Solid.js 或 Svelte 這樣的框架，因為它們會針對每個變量的依賴進行精確的更新，而不是整個組件樹的更新。  

	-	Observer Pattern:  
	  -	在 觀察者模式 中，通常是以 粗粒度 的方式來通知狀態的變更。當狀態變化時，所有訂閱者都會收到通知，這可能會引發較大的更新範圍。  

	  -	這種模式更常用於系統級別的事件通知，如事件驅動架構。  


4. 同步 vs 異步  

	-	Signal:  

	  -	信號的變化是 同步 的，這意味著當信號的值改變時，依賴於它的部分會立即進行更新。這可以確保數據的一致性，特別是在需要及時更新 UI 的場景中。  

	-	Observer Pattern:  

	  -	觀察者模式的通知通常是 異步 的，尤其是在事件驅動的系統中，狀態變更後會通知所有的訂閱者，但這些通知並不是立即執行的，通常是排隊執行。  


5. 使用場景  

	-	Signal:  

	  -	常用於框架內部的狀態管理與 UI 更新，如 Solid.js 和 Svelte。這些框架使用信號來追蹤應用中不同狀態的變化，並根據依賴進行精確的 UI 重繪。  

	  -	適用於需要高效、細粒度狀態更新的情境，尤其是大型應用中的複雜狀態變化。  
    
	-	Observer Pattern:  

	  -	適用於更廣泛的場景，特別是在系統事件、數據流或分佈式系統中，觀察者模式用於對象之間的鬆耦合通信。  

	  -	比如用於設計通知系統、事件總線或跨模塊的數據更新通知。  


比較總表：  

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
