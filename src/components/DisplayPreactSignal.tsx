import { signal, useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { FC } from "react";

const countSignal = signal(0);

const DisplayPreactSignal: FC = () => {
  useSignals(); // 等同於useMySignal綁在useEffect的處理, 
  // 這裡有部分原因是因為我的bundle tool不是採用babel, 不然可以省略這個步驟, 改從babel config做調整
  // const count = useSignal(0);
  return (
    <>
      <h3>Preact signal</h3>
      {/* <p>{count.value}</p> */}
      <p>{countSignal.value}</p>
      <div>
        {/* <button onClick={() => count.value++}>Count: {count.value}</button> */}
        <button onClick={() => countSignal.value++}>Count: {countSignal.value}</button>
      </div>
    </>
  );
}

export default DisplayPreactSignal;
