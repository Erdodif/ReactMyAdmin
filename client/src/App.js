import './App.scss';
import Sidebar from './Sidebar';
require('dotenv').config({path:"../.env"});
const serverUrl = process.env.SERVER_HOST+":"+process.env.SERVER_PORT;

function App() {
  return (
    <div className="App">
      <p>ReactMyAdmin</p>
      <Sidebar url={serverUrl} />
    </div>
  );
}

export default App;
