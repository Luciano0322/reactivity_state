# Fine-Grained Reactivity State

## 目錄  
- [簡介](#簡介)
- [背景](#背景)
- [關於Signal](#關於Signal)
- [Signal核心特性](#Signal核心特性)
- [API Architectures](#API-Architectures)
- [與Observer之間的差異](#與Observer之間的差異)
- [目前的概況](#目前的概況)

## 簡介  
做這個主題主要是想實踐一個 React 環境下的 Reactivity State Management, 也就是真正意義上的 Signal, 請務必先閱讀下面兩篇文章。  
[Introduction to Fine-Grained Reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf)  
[Building a Reactive Library from Scratch](https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p)  
我所做的研究是實踐上述提供的作法並與 React 環境下結合。  

## 背景  
事實上，TC39 正在考慮為 JavaScript 新增一種原生的響應式編程機制，也就是 [Signals](https://github.com/tc39/proposal-signals)。該提案旨在提供一種高效且易於使用的方式來管理應用程序狀態的變化，並自動更新依賴於這些狀態的部分。  

在現今 Web 發展的過程，響應式編程(Reactivity)變得越來越重要。開發者經常需要管理狀態的變化，並確保 UI 或其他依賴狀態的部分能夠及時更新。目前，這通常通過框架（如 React、Vue、Angular）或第三方的lib（如 MobX、RxJS）來實現。然而，這些解決方案都需要額外的lib支持，且各有不同的實現方法。

[![](https://i.ytimg.com/vi_webp/N1Ho-4fhYxY/maxresdefault.webp)](https://www.youtube.com/embed/N1Ho-4fhYxY?si=OL4kG93_2WjdKH_X)

這篇主要就是針對 signal 的底層邏輯一步步實作出真正意義上的細粒度響應式狀態管理工具(Fine-Grained Reactivity library);

## 關於Signal
Signal 是一種Reactivity(響應式)狀態管理方式，能夠高效的追蹤狀態變化，並更新相關的計算或組件。  

本篇將帶您一步步實現一個自定義的 Signal 狀態管理庫，支持基本的狀態管理、對象類型處理、並與 React 集成、批量更新以及異步操作。

## Signal核心特性
- Signal:  
  Signal 是一個包装值的對象，包含對該值的讀取和寫入方法，以及訂閱變化的能力。  
- 創建的方式:  
  可以通過 Signal 類或hook pattern來創建一個新的 Signal：
  ```ts
  const count = new Signal(0);
  // 或者
  const count = createSignal(0);
  ```  

- 讀取和寫入 Signal:  
  會依照選用pattern的不同有些微差異，如果是 hook 的方式會和他文章內提供的作法類似，另一種就是像Vue提供的處理方式  
  - 讀取：
  ```ts
  const value = count.value;
  // 或者
  const value = count.getValue();
  ```  
  - 寫入：  
  ```ts
  count.value = newValue;
  // 或者
  count.setValue(newValue);
  ```  

- Effect:  
  Effect 是一個函數，當其依賴的 Signal 發生變化時，會自動重新執行。通過 Effect，可以自動追蹤對 Signal 的讀取，並建立依賴關係。  
  ```ts
  effect(() => {
    console.log(`Count is: ${count.value}`);
  });
  // 或者
  effect(() => {
    console.log(`Count is: ${count.getValue()}`);
  });
  ```  
  當 count.value 發生變化時，傳入 effect 的函數會被重新執行。  
- 範例  
  ```ts
  const count = new Signal(0);

  // 透過 effect，當 count 變化時自動執行
  effect(() => {
    console.log(`Count changed to: ${count.value}`);
  });

  // 更新 Signal 的值
  count.value = 1; // 終端機輸出: Count changed to: 1
  count.value = 2; 
  ```  

## API Architectures 
![API Architectures](./source/data-flow.png)

- pull: 我們常用的 useState 就是屬於這一種，在我們每次渲染時會去問，資料是否有異動，有異動要觸發重新渲染。    
  - 特點：
	  - 惰性執行(lazy)：只有在數據被請求時，才會進行或更新。
    - 主動獲取：用戶需要主動調用某个方法來獲取最新的數據。
    - 減少不必要的計算：如果數據未被請求，則不會進行計算，節省資源。
- push: 可以簡單理解為 rxjs 的 observer pattern，就是把資料直接往下傳遞，通知所有訂閱者資料現況。
  - 特點：
    - 即時執行：一旦數據發生變化，相關的計算立即執行。
    - 被動接收：用戶被動地接收數據的更新，無需主動請求。
    - 實時性高：適用於需要立即響應數據變化的場景。
- Push-Pull: Push-Pull 结合了 Push 和 Pull 的特點。它在數據源頭發生變化時，會通知相關依賴者，但實際的計算可能會延遲到依賴者真正需要數據時才執行，例如useMemo，或是其他使用 signal 的框架。
  - 特點：
    - 通知更新：當數據源發生變化時，依賴者會被通知數據已過期或發生變化。
    - 惰性計算(lazy)：依賴者在需要時才進行計算，獲取最新的數據。
    - 減少不必要的計算：避免在數據頻繁變化但未被使用時進行多餘的計算。


## 與Observer之間的差異  

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


6. 比較總表：  

| 特性 | 	Signal	| Observer Pattern |
| --- | --- | --- |
| 依賴管理	| 自動追蹤依賴，細粒度更新	| 不關注依賴，訂閱者全局接收更新通知| 
| 變更通知範圍	| 精確通知直接依賴的部分	| 所有訂閱者都會收到變更通知| 
| 設計目標	| 高效、細粒度的狀態管理與 UI 更新	| 廣播式通知，適合鬆耦合系統或事件驅動系統| 
| 更新模式	| 同步，變化即時觸發依賴更新	| 異步或同步，視具體實現而定| 
| 使用場景	| 前端框架中的狀態管理（如 Solid.js, Svelte）	| 系統級事件處理、事件總線、數據流管理等|   

## 目前的概況
![顆粒度比較](./source/compare.png)  

![現行框架狀態](./source/compare_fine.png)

