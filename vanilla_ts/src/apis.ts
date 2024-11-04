import { createEffect, createMySignal, runInBatch, withContext } from "./signal/core";

const pokemonSignal = createMySignal(null);

async function fetchDataAndUpdateSignal() {
  const data = await fetch("https://pokeapi.co/api/v2/pokemon").then((res) => res.json());
  // 使用runInBatch做signal的更新，這裡可以適應成多個的用法
  runInBatch(() => {
    pokemonSignal.write(data);
  });
}

export function pokemonsDisplay(element: HTMLParagraphElement) {
  // #1 使用recommend
  // fetchDataAndUpdateSignal();
  // createEffect(() => {element.innerText = `Display for pokemon: ${JSON.stringify(pokemonSignal.read())}`});
  // #2 使用withContext
  createEffect(() => {
    withContext(async () => {
        // const data = await fetch("https://pokeapi.co/api/v2/pokemon").then((res) => res.json());
        // pokemonSignal.write(data);
        // 也可以直接
        await fetchDataAndUpdateSignal();
      element.innerText = `Display for pokemon: ${JSON.stringify(pokemonSignal.read())}`
    });
  })
}