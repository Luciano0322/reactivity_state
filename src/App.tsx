import { useSignals } from '@preact/signals-react/runtime';
import './App.css';
import { createMySignal, useMySignal } from './signal';
import { useSignal } from '@preact/signals-react';

const countSignal = createMySignal(0);

const App = () => {
  useSignals(); // 等同於useMySignal綁在useEffect的處理
  const [count, setCount] = useMySignal(countSignal);
  const count2 = useSignal(0);
  const increment = () => {
    setCount(count + 1);
  };
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>{count2.value}</p>
      <div>
        {/* <button onClick={increment}>++</button> */}
        <button onClick={() => count2.value++}>++</button>
      </div>
    </div>
  );
};

export default App;
