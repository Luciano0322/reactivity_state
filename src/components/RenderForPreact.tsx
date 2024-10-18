import { effect, signal, useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

// 定義 store 的結構
interface Store {
  count: number;
  name: string;
}

// 從自定義的signal to Preact signal
// 這樣的操作會使得每個節點都含有各自的signal, 與我自定義相同
const preactVerStore = signal<Store>({
  count: 0,
  name: "",
});

effect(() => {
  console.log("check store: ", preactVerStore.value);
});

const TextInput: React.FC = () => {
  useSignals();
  const value = 'name';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    preactVerStore.value = {
      ...preactVerStore.value,
      [value]: e.target.value,
    };
  };
  return (
    <fieldset className="field">
      <legend>{value}: </legend>
      <input
        value={preactVerStore.value.name}
        onChange={handleChange}
      />
    </fieldset>
  );
};

const OrderBtns: React.FC = () => {
  useSignals();
  const value = 'count';
  const increment = () => {
    preactVerStore.value = {
      ...preactVerStore.value,
      [value]: preactVerStore.value.count + 1,
    };
  };

  const decrement = () => {
    preactVerStore.value = {
      ...preactVerStore.value,
      [value]: preactVerStore.value.count - 1,
    };
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center"
      }}
    >
      <button
        onClick={decrement}
      >
        -
      </button>
      <button
        onClick={increment}
      >
        +
      </button>
    </div>
  );
};

const InputContainer: React.FC = () => {
  return (
    <div className="container">
      <h5>輸入面板</h5>
      <OrderBtns />
      <TextInput />
    </div>
  );
};

interface DisplayProps {
  value: keyof Store;
}

const Display: React.FC<DisplayProps> = ({ value }) => {
  useSignals();
  const signalValue = preactVerStore.value[value];
  return (
    <div className="value">
      {value}: {signalValue}
    </div>
  );
};

const DisplayContainer: React.FC = () => (
  <div className="container">
    <h5>已成立訂單</h5>
    <Display value="count" />
    <Display value="name" />
  </div>
);

// 稍微有點小麻煩，尤其層數很多的話處理起來很不方便，優化的部分沒有我自己寫的好，比較類似jotai可以分離版。
const RenderForPreact: React.FC = () => {
  return (
    <>
      <h1>coffee shop preact version</h1>
      <div className="container">
        <h5>訂單系統</h5>
        <InputContainer />
        <DisplayContainer />
      </div>
    </>
  );
};

export default RenderForPreact;
