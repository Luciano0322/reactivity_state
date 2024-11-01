import './App.css';
import DisplayPreactSignal from './components/DisplayPreactSignal';
import DisplayMySignal from './components/DisplayMySignal';
import DisplayProxyVersion from './components/DisplayProxyVersing';
import RenderTemplate from './components/RenderTemplate';
import RenderForPreact from './components/RenderForPreact';
import DisplayAsyncSignal from './components/DIsplayAsyncSignal';

const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      {/* <DisplayPreactSignal /> */}
      {/* <RenderForPreact /> */}
      {/* <DisplayMySignal />
      <DisplayProxyVersion /> */}
      {/* <RenderTemplate/> */}
      <DisplayAsyncSignal />
    </div>
  );
};

export default App;
