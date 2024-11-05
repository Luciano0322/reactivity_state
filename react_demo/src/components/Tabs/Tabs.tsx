// Tabs/Tabs.tsx
import React from 'react';
import { Tab, ITabProps } from './Tab';
import { Panel, IPanelProps } from './Panel';

interface ITabsContext {
  activeTab: string;
  setActiveTab: (label: string) => void;
}
// 這裡我們需要用到children，那下面是使用ts的方法
interface ITabsComposition {
  Tab: React.FC<React.PropsWithChildren<ITabProps>>;
  Panel: React.FC<React.PropsWithChildren<IPanelProps>>;
}
// 這裡我們先createContext之後再透過Provider的方式讓整個群體
// 透過useContext去提取資料
const TabsContext = React.createContext<ITabsContext | undefined>(undefined);

const Tabs: React.FC<React.PropsWithChildren> & ITabsComposition = (props) => {
  const [activeTab, setActiveTab] = React.useState('');

  // 這裡應該都不陌生了吧，我前面介紹Memo的時候已經非常詳細為什麼要使用useMemo了
  // 還不懂的可以參考https://medium.com/@LeeLuciano/react-%E7%9A%84%E9%82%A3%E4%BA%9B%E4%BA%8B-memo-1cf1cca55167
  const memoizedContextValue = React.useMemo(
    () => ({
      activeTab,
      setActiveTab,
    }),
    [activeTab, setActiveTab],
  );

  return (
    <TabsContext.Provider value={memoizedContextValue}>
      {props.children}
    </TabsContext.Provider>
  );
};

// 做個簡單的提醒，避免直接使用的error，這通常會在後面階段才回來補。
export const useTabs = (): ITabsContext => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('該組件必須包在 <Tabs> 裡面');
  }
  return context;
};

Tabs.Tab = Tab;
Tabs.Panel = Panel;

export { Tabs };