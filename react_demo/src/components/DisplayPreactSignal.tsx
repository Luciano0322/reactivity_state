import { computed, signal, useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { FC } from "react";

const countSignal = signal(0);
const doubleCount = computed(() => countSignal.value * 2);

const DisplayPreactSignal: FC = () => {
  useSignals(); // 等同於useMySignal綁在useEffect的處理, 
  // 這裡有部分原因是因為我的bundle tool不是採用babel, 不然可以省略這個步驟, 改從babel config做調整

  return (
    <>
      <h3>Preact signal</h3>
      <p>x2: {doubleCount}</p>
      <div>
        <button onClick={() => countSignal.value++}>Count: {countSignal.value}</button>
      </div>
    </>
  );
}

export default DisplayPreactSignal;
