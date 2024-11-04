import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { countDisplay, setupAdder, setupMiner } from './counter.ts'
import { setupInput, setupOrderAdder, setupOrderMiner, systemCountDisplay, systemNameDisplay } from './system.ts'
import { pokemonsDisplay } from './apis.ts'

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
      <p id="countData"></p>
      <button id="miner" type="button"></button>
      <button id="adder" type="button"></button>
    </div>
    <div class="card">
      <h2>訂單系統</h2>
      <div>
        <h5>輸入面板</h5>
        <div>
          <button id="order_miner" type="button"></button>
          <button id="order_adder" type="button"></button>
        </div>
        <fieldset className="field">
          <legend>Order Name</legend>
          <input id="system_input" />
        </fieldset>
      </div>
      <div>
        <h5>已成立訂單</h5>
        <p id="system_count"></p>
        <p id="system_name"></p>
      </div>
    </div>
    <div class="card">
      <p id="pokemons_Data"></p>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

countDisplay(document.querySelector<HTMLParagraphElement>('#countData')!)
setupAdder(document.querySelector<HTMLButtonElement>('#adder')!)
setupMiner(document.querySelector<HTMLButtonElement>('#miner')!)
setupOrderMiner(document.querySelector<HTMLButtonElement>('#order_miner')!)
setupOrderAdder(document.querySelector<HTMLButtonElement>('#order_adder')!)
setupInput(document.querySelector<HTMLInputElement>('#system_input')!)
systemCountDisplay(document.querySelector<HTMLParagraphElement>('#system_count')!)
systemNameDisplay(document.querySelector<HTMLParagraphElement>('#system_name')!)
pokemonsDisplay(document.querySelector<HTMLParagraphElement>('#pokemons_Data')!)
