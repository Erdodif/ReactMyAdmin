import './index.scss';
import './App.scss';
import React from 'react';
import Sidebar from './Sidebar';
import Navigation from './Navigation';
import QueryPage from './QueryPage';
import { Redirect } from 'react-router';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams
} from "react-router-dom";

const serverUrl = "http://" + process.env.REACT_APP_SERVER_HOST + ":" + process.env.REACT_APP_SERVER_PORT +"/api";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: 0,
      database: "INFORMATION_SCHEMA",
      table: "TABLES"
    };
    this.selectDatabase = this.selectDatabase.bind(this);
  }

  render() {
    return (
      <div className={"App theme" + this.state.theme} key={"App"} id="App">
        <Sidebar url={serverUrl+"/databases"} syncTable={this.selectTable} />
        <Navigation />
        <Router>
          <Routes>
            <Route exact path="/" element={<QueryPage url={serverUrl} database={this.state.database} table={this.state.table} />} />
          </Routes>
        </Router>
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
