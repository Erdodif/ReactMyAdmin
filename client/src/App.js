import './index.scss';
import './App.scss';
import Sidebar from './Sidebar';
import React from 'react';
const serverUrl = "http://"+process.env.REACT_APP_SERVER_HOST+":"+process.env.REACT_APP_SERVER_PORT;

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {theme:0};
  }

  render(){
    return (
      <div className={"App theme" + this.state.theme} key={"App"}>
        <Sidebar url={serverUrl}/>
      </div>
    );
  }
  
}

export default App;
