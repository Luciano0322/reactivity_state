import { FC } from "react";
import { createProxySignal, useProxySignal } from "../proxyVersion";

const state = createProxySignal({ count: 0 });

const DisplayProxyVersion: FC = () => {
  const reactiveState = useProxySignal(state);

  const increment = () => {
    reactiveState.count += 1;
  };
  return (
    <>
      <h3>改成以 Proxy 為基底的作法所實現的 signal</h3>
      <p>{reactiveState.count}</p>
      <div>
        <button onClick={increment}>count: {state.getSnapshot().count}</button>
      </div>
    </>
  ); 
};

export default DisplayProxyVersion;
