import { FC, MouseEvent, useState } from "react";
import { createMySignal, useMySignal } from "../signal";

const countSignal = createMySignal(0);
// 一定要處理綁定的過程，你的signal才會被正確執行
const DisplayMySignal: FC = () => {
  const [countS, setCountS]= useState(0);
  const count = useMySignal(countSignal);
  const incrementS = (evt: MouseEvent<HTMLButtonElement>) => {
    setCountS((pre) => pre +1);
    console.log(`from state count: ${countS}, DOM: ${evt.currentTarget.innerText}`)
  }
  const increment = (evt: MouseEvent<HTMLButtonElement>) => {
    // countSignal.write(count + 1);
    countSignal.write((pre) => pre +1);
    console.log(`from signal count: ${countSignal.read()}, hooks count: ${count}, DOM: ${evt.currentTarget.innerText}`)
  }

  return (
    <>
      <h3>原生的state</h3>
      <div>
        <button onClick={incrementS}>count: {countS}</button>
      </div>
      <h3>按照 solid js 的作法所實現的 signal</h3>
      <p>{count}</p>
      <div>
        <button onClick={increment}>count: {countSignal.read()}</button>
      </div>
    </>
  ); 
}

export default DisplayMySignal;
