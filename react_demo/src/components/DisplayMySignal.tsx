import { FC, MouseEvent, useState } from "react";
import { createMySignal, useMySignal } from "../signal";
import { createSegnale } from 'segnale-react';
import { useSegnale } from 'segnale-react';

const countSignal = createMySignal(0);
// 一定要處理綁定的過程，你的signal才會被正確執行
const countSegnal = createSegnale<number>(0);
const DisplayMySignal: FC = () => {
  const [countS, setCountS]= useState(0);
  const count = useMySignal(countSignal);
  const countT = useSegnale<number>(countSegnal);
  const incrementS = (evt: MouseEvent<HTMLButtonElement>) => {
    setCountS((pre) => {
      console.log('pre: ', pre + 1);
      return pre + 1
    });
    console.log(`from state count: ${countS}, DOM: ${evt.currentTarget.innerText}`)
  }
  const increment = (evt: MouseEvent<HTMLButtonElement>) => {
    // countSignal.write(count + 1);
    countSignal.write((pre) => pre +1);
    console.log(`from signal count: ${countSignal.read()}, hooks count: ${count}, DOM: ${evt.currentTarget.innerText}`)
  }
  const inc = (evt: MouseEvent<HTMLButtonElement>) => {
    countSegnal.write((pre: number) => pre + 1);
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
      <h3>Segnale</h3>
      <p>{countT}</p>
      <div>
        <button onClick={inc}>count: {countSegnal.read()}</button>
      </div>
    </>
  ); 
}

export default DisplayMySignal;
