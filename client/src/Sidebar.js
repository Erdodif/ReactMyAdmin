import React from "react";

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            databases: [],
            search: "",
            selected: null,
            tables: []
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
        fetch(this.props.url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
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

    render(){
        return (
            <div className="Sidebar">
                <div className="Searchbar">
                    <input type="text" />
                </div>
                <div className="Databases">
                    {this.state.databases.map((database)=><Database name={database.name} />)}
                </div>
            </div>
        );
    }
}

class Database extends React.Component {
    constructor(props){
        super(props);
        this.state = { selected: false, tables:[]};
    }

    render(){
        const {name, selected} = this.props;
        return(
            <div className={selected?"holder":"holder table-selected"}>
                <div>
                    {/* dropdown icon*/"i"}
                </div>
                <div>
                    {name}
                </div>
                <div className="Tables">
                    {this.state.tables.map((table)=><Table name={table.name} />)}
                </div>
            </div>
        );
    }
}

class Table extends React.Component {
    constructor(props){
        super(props);
        this.state = { selected: false };
    }

    render(){
        const {name, selected} = this.props;
        return(
            <div className={selected?"":"table-selected"}>
                {name}
            </div>
        );
    }
}