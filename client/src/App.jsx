import './index.scss';
import './App.scss';
import React from 'react';
import Sidebar from './Sidebar';
import Navigation from './Navigation';
import QueryPage from './QueryPage';
const serverUrl = "http://" + process.env.REACT_APP_SERVER_HOST + ":" + process.env.REACT_APP_SERVER_PORT;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: 0,
      database: "film",
      table: "filmek"
    };
    this.selectDatabase = this.selectDatabase.bind(this);
  }

  render() {
    return (
      <div className={"App theme" + this.state.theme} key={"App"} id="App">
        <Sidebar url={serverUrl} syncTable={this.selectTable}/>
        <Navigation />
        <QueryPage url={serverUrl} database={this.state.database} table={this.state.table} />
      </div>
    );
  }

  selectDatabase = (database) => {
    this.setState({ database: database });
  }

  selectTable = (database, table) => {
    this.setState({
      database: database,
      table: table
    });
  }

}

export default App;
