import LeftPanel from './components/LeftPanel/LeftPanel';
import CenterPanel from './components/CenterPanel/CenterPanel';
import RightPanel from './components/RightPanel/RightPanel';
import { Provider } from './context';
import './App.css';
import ToDoList from './components/ToDoList';

function App() {
  return (
    <Provider>
      <div className="App">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
        <ToDoList />
      </div>
    </Provider>
  );
}

export default App;
