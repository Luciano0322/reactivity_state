import { FC } from "react";
import { createMySignal, useMySignal } from "../signal";

const countSignal = createMySignal(0);

const DisplayMySignal: FC = () => {
  const [count, setCount] = useMySignal(countSignal);
  const increment = () => {
    setCount(count + 1);
  };
  return (
    <>
      <h3>按照 solid js 的作法所實現的 signal</h3>
      <p>{count}</p>
      <div>
        <button onClick={increment}>count: {count} {Math.random()}</button>
      </div>
    </>
  ); 
}

export default DisplayMySignal;
