import './Sidebar.scss';
import React from "react";
const CORS_HEADERS_GET = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    headers: {
        'Accept': 'application/json'
    }
};

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            databases: [],
            search: "",
            selected: null
        };
    }

    componentDidMount() {
        this.fillSidebar();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.url !== this.state.url) {
            this.fillSidebar();
        }
    }

    fillSidebar() {
        fetch(this.props.url, CORS_HEADERS_GET).then(response => {
            return response.json();
        }).then(data => {
            let databaseArray = [];
            for (const database of data.databases) {
                databaseArray.push({ label: database });
            }
            this.setState({ databases: databaseArray });
        }).catch(error => {
            console.error(error);
            alert(error);
        });
    }

    hideSidebar() {
        let app = document.querySelector("#App");
        let state = document.getElementById("hide-sidebar").checked;
        let sidebar = document.querySelector(".Sidebar");
        if(state){
            app.classList.add("noSidebar");
            sidebar.classList.add("hidden");
        }
        else{
            app.classList.remove("noSidebar");
            sidebar.classList.remove("hidden");
        }
        
    }

    render() {
        return (
            <div className="Sidebar" >
                <input type="checkbox" name="hide-sidebar" id="hide-sidebar" onChange={this.hideSidebar} />
                <label htmlFor="hide-sidebar" id="sidebar-button">
                    <img src="arrow_up.ico" alt="" />
                </label>
                <div id="Sidebar">
                    <img className="Logo" src="reactmyadmin_logo_text.svg" alt="ReactMyAdmin" />
                    <div className="Searchbar" key={"Searchbar"}>
                        <input type="text" />
                    </div>
                    <div className="Databases" key={"Databases"}>
                        {this.state.databases.map((database) => <Database url={this.props.url} syncTable={(database, table) => this.props.syncTable(database, table)} name={database.label} key={database.label} />)}
                    </div>
                </div>
            </div>
        );
    }
}

class Database extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: false, tables: [] };
    }

    switchSelected() {
        this.setState({ selected: (!this.state.selected) });
    }

    render() {
        const { name } = this.props;
        const selected = this.state.selected;
        const url = this.props.url + "/" + name;
        return (
            <div className={selected === true ? "Database selected" : "Database"} key={"Database " + name}>
                <div onClick={() => this.switchSelected()}>
                    <img src="arrow_up.ico" alt="" />
                    {name}
                </div>
                <Tables url={url} key={"Tables of " + name} syncTable={(table) => this.props.syncTable(name, table)} selected={this.state.selected} />
            </div>
        );
    }
}

class Tables extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tables: null };
    }

    componentDidMount() {
        this.setTables();
    }


    componentDidUpdate(prevProps, prevState) {
        if (this.state.tables === null) {
            this.setTables();
        }
    }

    setTables() {
        if (this.props.selected) {
            fetch(this.props.url, CORS_HEADERS_GET
            ).then(response => {
                return response.json();
            }).then(data => {
                console.log(data);
                let tableArray = [];
                for (const table of data.tables) {
                    tableArray.push({ name: table });
                }
                this.setState({ tables: tableArray });
            }).catch(error => {
                console.error(error);
                alert(error);
            });
        }
    }

    render() {
        let tables = null;
        if (this.state.tables !== null && this.props.selected) {
            tables = this.state.tables.map(
                (table) => <Table name={table.name} key={"Table " + table.name} syncTable={this.props.syncTable} />
            );
        }
        return (
            <div className="Tables">
                {tables}
            </div>
        );
    }
}

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: false };
    }

    render() {
        const { name, selected } = this.props;
        return (
            <div className={selected ? "Table" : "Table selected"} onClick={() => { this.props.syncTable(name); console.log(name); }}>
                {name}
            </div>
        );
    }
}