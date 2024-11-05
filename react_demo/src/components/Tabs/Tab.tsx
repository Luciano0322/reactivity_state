import React from "react";
import { useTabs } from "./Tabs";

export interface ITabProps {
  label: string;
}
// 我這裡有掛tailwindcss的code，style的部分可以自行調整
export const Tab: React.FC<React.PropsWithChildren<ITabProps>> = props => {
  // 如果沒用custom hook的朋友可以透過useContext的方式再去取一次
  const { activeTab, setActiveTab } = useTabs();

  return (
    <div 
      className={activeTab === props.label ? `border-b-2 border-red-400` : ``}
    >
      <button onClick={() => setActiveTab(props.label)}>
        {props.children}
      </button>
    </div>
  );
};