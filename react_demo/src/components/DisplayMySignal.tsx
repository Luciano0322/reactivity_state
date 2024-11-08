import { FC, useMemo } from "react";
import { createMySignal, useMySignal } from "../signal";
import { createEffect } from "../signal/core";

const countSignal = createMySignal(0);
// 一定要處理綁定的過程，你的signal才會被正確執行
const DisplayMySignal: FC = () => {
  // const countSignal = useMemo(() => createMySignal(0), [])
  const count = useMySignal(countSignal);
  // const increment = () => {
  //   setCount(count + 1);
  // };
  // createEffect(() => console.log('countSignal: ', countSignal.read()))
  const increment = () => {
    // countSignal.write(count + 1);
    countSignal.write((pre) => pre +1);
  }
  return (
    <>
      <h3>按照 solid js 的作法所實現的 signal</h3>
      <p>{count}</p>
      <div>
        <button onClick={increment}>count: {count}</button>
      </div>
    </>
  ); 
}

export default DisplayMySignal;
