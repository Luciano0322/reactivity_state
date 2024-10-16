import './App.css';
import DisplayMySignal from './components/DisplayMySignal';
import DisplayProxyVersion from './components/DisplayProxyVersing';


const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <DisplayMySignal />
      <DisplayProxyVersion />
    </div>
  );
};

export default App;
