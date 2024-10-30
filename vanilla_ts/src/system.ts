import { createEffect, createMySignal } from "./signal/core";

const systemSignal = createMySignal({
  count: 0,
  name: ""
});

export function setupInput(element: HTMLInputElement) {
  element.value = "";
  const setInput = (evt: Event) => {
    const target = evt.target as HTMLInputElement;
    systemSignal.name.write(target.value);
  }
  element.addEventListener('input', setInput)
}

export function setupOrderMiner(element: HTMLButtonElement) {
  element.innerHTML = `-`
  const setCounter = (count: number) => {
    if (systemSignal.count.read() > 0) systemSignal.count.write(count);
  }
  element.addEventListener('click', () => setCounter(systemSignal.count.read() - 1))
}

export function setupOrderAdder(element: HTMLButtonElement) {
  element.innerHTML = `+`
  const setCounter = (count: number) => {
    systemSignal.count.write(count);
  }
  element.addEventListener('click', () => setCounter(systemSignal.count.read() + 1))
}

export function systemNameDisplay(element: HTMLParagraphElement) {
  createEffect(() => {element.innerText = `Order Name: ${systemSignal.name.read()}`});
}

export function systemCountDisplay(element: HTMLParagraphElement) {
  createEffect(() => {element.innerText = `Order Count: ${systemSignal.count.read()}`});
}
