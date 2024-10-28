import { createMySignal } from "../signal";
import { useMySignal, useMySignalAsyncEffect } from "../signal/useSignal";

const dataSignal = createMySignal(null);

const DisplayAsyncSignal = () => {
  // 直接寫入 signal, 用法就跟一般 useEffect 的 dependencies 一樣, 空陣列不能忘
  useMySignalAsyncEffect(async () => {
    const data = await fetch("https://pokeapi.co/api/v2/pokemon").then((res) => res.json());
    dataSignal.write(data);
  }, []);
  const displayContent = useMySignal(dataSignal);
  // 如果是在react環境下，其實不需要處理 async 帶入的方法，其實本質上就和直接透過useEffect 去打 api 的操作是一樣的
  // 但還是有實作出來，實務上還是會建議使用 tanstack-query/react-query 來處理 api

  return (
    <div>{displayContent ? JSON.stringify(displayContent) : 'Loading...'}</div>
  );
};

export default DisplayAsyncSignal;