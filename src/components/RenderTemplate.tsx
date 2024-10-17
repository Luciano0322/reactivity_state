import { useState } from "react";
import { createMySignal } from "../signal";
import { useMySignal3 } from "../signal/useSignal";

// 這是使用state props & 改用 signal 最明顯的差異
// 這樣的使用可以降低 props useMemo & useCallback 的封包使用

// 定義 store 的結構
interface Store {
  count: number;
  name: string;
}

interface TextInputProps {
  value: keyof Store; // value 是 Store 的屬性之一
  // store: [Store, React.Dispatch<React.SetStateAction<Store>>];
}

// const TextInput: React.FC<TextInputProps> = ({ value, store }) => {
const TextInput: React.FC<TextInputProps> = ({ value }) => {
  // const [data, setStore] = store;
  const data = useMySignal3(storeSignal)
  return (
    <fieldset className="field">
      <legend>{value}: </legend>
      <input
        value={data[value]}
        // onChange={(e) => setStore({ ...data, [value]: e.target.value })}
        onChange={(e) => storeSignal.write({ ...data, [value]: e.target.value })}
      />
    </fieldset>
  );
};

interface OrderBtnsProps {
  value: keyof Store; // value 是 Store 的屬性之一
  // store: [Store, React.Dispatch<React.SetStateAction<Store>>];
}

// const OrderBtns: React.FC<OrderBtnsProps> = ({ value, store }) => {
const OrderBtns: React.FC<OrderBtnsProps> = ({ value }) => {
  // const [data, setStore] = store;
  const data = useMySignal3(storeSignal);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center"
      }}
    >
      <button
        // onClick={() => setStore({ ...data, [value]: (data[value] as number) - 1 })}
        onClick={() => storeSignal.write({ ...data, [value]: (data[value] as number) - 1 })}
      >
        -
      </button>
      <button
        // onClick={() => setStore({ ...data, [value]: (data[value] as number) + 1 })}
        onClick={() => storeSignal.write({ ...data, [value]: (data[value] as number) + 1 })}
      >
        +
      </button>
    </div>
  );
};

// const InputContainer: React.FC<{store: [Store, React.Dispatch<React.SetStateAction<Store>>];}> = ({ store }) => {
const InputContainer: React.FC = () => {
  return (
    <div className="container">
      <h5>輸入面板</h5>
      {/* <OrderBtns value="count" store={store}/>
      <TextInput value="name" store={store}/> */}
      <OrderBtns value="count" />
      <TextInput value="name" />
    </div>
  );
};

interface DisplayProps {
  value: keyof Store;
  // store: [Store, React.Dispatch<React.SetStateAction<Store>>];
}

// const Display: React.FC<DisplayProps> = ({ value, store }) => {
const Display: React.FC<DisplayProps> = ({ value }) => {
  // const [data, setStore] = store;
  const data = useMySignal3(storeSignal);
  return (
    <div className="value">
      {value}: {data[value]}
    </div>
  );
};

// const DisplayContainer: React.FC<{store: [Store, React.Dispatch<React.SetStateAction<Store>>];}> = ({store}) => (
const DisplayContainer: React.FC = () => (
  <div className="container">
    <h5>已成立訂單</h5>
    {/* <Display value="count" store={store} />
    <Display value="name" store={store} /> */}
    <Display value="count" />
    <Display value="name" />
  </div>
);

const storeSignal = createMySignal({
  count: 0,
  name: ""
});

const RenderTemplate: React.FC = () => {
  // const store = useState<Store>({
  //   count: 0,
  //   name: ""
  // });

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