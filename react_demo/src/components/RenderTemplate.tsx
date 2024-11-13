import { useMemo, useState } from "react";
import { createMySignal, useMySignal, useMySignalEffect } from "../signal";
import { MySignal } from "../signal/types";

// 這是使用state props & 改用 signal 最明顯的差異
// 這樣的使用可以降低 props useMemo & useCallback 的封包使用

// 定義 store 的結構
interface Store {
  count: number;
  name: string;
}

const TextInput: React.FC = () => {
  const value = 'name';
  const data = useMySignal(storeSignal[value]);
  useMySignalEffect(() => console.log('txtInput data: ', data), [data])

  return (
    <fieldset className="field">
      <legend>{value}: </legend>
      <input
        value={data}
        onChange={(e) => storeSignal[value].write(e.target.value)}
      />
    </fieldset>
  );
};

const OrderBtns: React.FC = () => {
  const value = 'count';
  const data = useMySignal(storeSignal[value]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center"
      }}
    >
      <button
        onClick={() => storeSignal[value].write((pre) => pre - 1)}
      >
        -
      </button>
      <button
        onClick={() => storeSignal[value].write(data + 1)}
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
  const signal = storeSignal[value];
  const data = typeof signal.read() === 'number'
    ? useMySignal(signal as MySignal<number>)
    : useMySignal(signal as MySignal<string>);

  return (
    <div className="value">
      {value}: {data}
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

const storeSignal = createMySignal({
  count: 0,
  name: ""
});

const RenderTemplate: React.FC = () => {

  return (
    <>
      <h1>coffee shop</h1>
      <div className="container">
        <h5>訂單系統</h5>
        <InputContainer />
        <DisplayContainer />
      </div>
    </>
  );
};

export default RenderTemplate;