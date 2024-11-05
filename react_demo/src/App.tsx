import './App.css';
import DisplayPreactSignal from './components/DisplayPreactSignal';
import DisplayMySignal from './components/DisplayMySignal';
import DisplayProxyVersion from './components/DisplayProxyVersing';
import RenderTemplate from './components/RenderTemplate';
import RenderForPreact from './components/RenderForPreact';
import DisplayAsyncSignal from './components/DIsplayAsyncSignal';
import { Tabs } from './components/Tabs';

const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <Tabs>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem"}}>
          <Tabs.Tab label="basic">basic version</Tabs.Tab>
          <Tabs.Tab label="proxy">proxy version</Tabs.Tab>
          <Tabs.Tab label="preact">preact version</Tabs.Tab>
          <Tabs.Tab label="preactRender">preact Template</Tabs.Tab>
          <Tabs.Tab label="mySignalRender">mySignal Template</Tabs.Tab>
          <Tabs.Tab label="mySignalAsync">support async</Tabs.Tab>
        </div>
        <Tabs.Panel label="basic">
          <DisplayMySignal />
        </Tabs.Panel>
        <Tabs.Panel label="proxy">
          <DisplayProxyVersion />
        </Tabs.Panel>
        <Tabs.Panel label="preact">
          <DisplayPreactSignal />
        </Tabs.Panel>
        <Tabs.Panel label="preactRender">
          <RenderForPreact />
        </Tabs.Panel>
        <Tabs.Panel label="mySignalRender">
          <RenderTemplate/>
        </Tabs.Panel>
        <Tabs.Panel label="mySignalAsync">
          <DisplayAsyncSignal />
        </Tabs.Panel>
      </Tabs>
      
      
      
      
      
      
    </div>
  );
};

export default App;
