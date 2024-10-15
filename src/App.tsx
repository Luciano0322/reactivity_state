import './App.css';
import { createMySignal, useMySignal } from './signal';

const countSignal = createMySignal(0);

const App = () => {
  const [count, setCount] = useMySignal(countSignal);
  const increment = () => {
    setCount(count + 1);
  };
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>{count}</p>
      <div>
        <button onClick={increment}>++</button>
      </div>
    </div>
  );
};

export default App;
