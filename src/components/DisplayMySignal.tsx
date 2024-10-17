import { FC } from "react";
import { createMySignal, useMySignal } from "../signal";
import { useMySignal2, useMySignal3 } from "../signal/useSignal";
import { createEffect } from "../signal/core";

const countSignal = createMySignal(0);
// 一定要處理綁定的過程，你的signal才會被正確執行
const DisplayMySignal: FC = () => {
  // const [count, setCount] = useMySignal(countSignal);
  // const count = useMySignal2(countSignal);
  const count = useMySignal3(countSignal);
  // const increment = () => {
  //   setCount(count + 1);
  // };
  // createEffect(() => console.log('countSignal: ', countSignal.read()))
  const increment = () => {
    countSignal.write(countSignal.read() + 1);
  }
  return (
    <>
      <h3>按照 solid js 的作法所實現的 signal</h3>
      <p>{count}</p>
      <div>
        <button onClick={increment}>count: {countSignal.read()} {Math.random()}</button>
      </div>
    </>
  ); 
}

export default DisplayMySignal;
