import './App.css';
import DisplayPreactSignal from './components/DisplayPreactSignal';
import DisplayMySignal from './components/DisplayMySignal';
import DisplayProxyVersion from './components/DisplayProxyVersing';
import RenderTemplate from './components/RenderTemplate';

const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <DisplayPreactSignal />
      {/* <DisplayMySignal />
      <DisplayProxyVersion /> */}
      <RenderTemplate/>
    </div>
  );
};

export default App;
