import { createEffect, createMySignal } from "./signal/core"
const countSignal = createMySignal(0);

export function setupAdder(element: HTMLButtonElement) {
  // let counter = 0
  // const setCounter = (count: number) => {
  //   counter = count
  //   element.innerHTML = `count is ${counter}`
  // }
  element.innerHTML = `+`
  const setCounter = (count: number) => {
    countSignal.write(count);
  }
  element.addEventListener('click', () => setCounter(countSignal.read() + 1))
}

export function setupMiner(element: HTMLButtonElement) {
  // let counter = 0
  // const setCounter = (count: number) => {
  //   counter = count
  //   element.innerHTML = `count is ${counter}`
  // }
  element.innerHTML = `-`
  const setCounter = (count: number) => {
    countSignal.write(count);
  }
  element.addEventListener('click', () => setCounter(countSignal.read() - 1))
}

export function countDisplay(element: HTMLParagraphElement) {
  createEffect(() => {element.innerText = `Display for count: ${countSignal.read()}`});
}


