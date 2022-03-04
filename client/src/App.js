import './App.scss';
import Sidebar from './Sidebar';
const serverUrl = "http://"+process.env.REACT_APP_SERVER_HOST+":"+process.env.REACT_APP_SERVER_PORT;

function App() {
  return (
    <div className="App">
      <p>ReactMyAdmin</p>
      <Sidebar url={serverUrl} />
    </div>
  );
}

export default App;
