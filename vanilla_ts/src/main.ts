import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { countDisplay, setupAdder, setupMiner } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <p id="countData"><p>
      <button id="miner" type="button"></button>
      <button id="adder" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

countDisplay(document.querySelector<HTMLParagraphElement>('#countData')!)
setupAdder(document.querySelector<HTMLButtonElement>('#adder')!)
setupMiner(document.querySelector<HTMLButtonElement>('#miner')!)
