import './QueryPage.scss';
import React from "react";
import Highlighter from "./highlighting";
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
const CORS_HEADERS_POST = (body) => {
    return {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
    }
};

export default class QueryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            query: ''
        };
    }

    componentDidMount() {
        this.getQueryTable();
        this.fillSuggestion();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.table !== this.props.table) {
            this.getQueryTable();
            this.fillSuggestion();
        }
        if (prevState.query !== this.state.query) {
            this.fillQueryResults();
        }
    }

    getQueryTable() {
        let url = this.props.url + "/" + this.props.database + "/" + this.props.table;
        fetch(url, CORS_HEADERS_GET).then(response => {
            return response.json();
        }).then(data => {
            let resultArray = [];
            for (const result of data.content) {
                resultArray.push(result);
            }
            this.setState({ results: resultArray });
        }).catch(error => {
            console.error(error);
            alert(error);
        });
    }

    fillSuggestion() {
        //TODO
    }

    runQuery = () => {
        let url = this.props.url + "/query";
        let database = this.props.database;
        console.log(this.props.url);
        console.log(this.props.database);
        let query = document.getElementById("QueryEditor").innerText;
        if (query === null || query === undefined || query === "") {
            query = 'SELECT * FROM ' + this.props.table + ';';
        }
        console.log(CORS_HEADERS_POST({
            database: database,
            sql: query
        }));
        console.log(CORS_HEADERS_POST({
            database: database,
            sql: query
        }).body);
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                database: database,
                sql: query
            })
        }).then(response => {
            console.log(response);
            return response.json();
        }).then(data => {
            console.log(data);
            let resultArray = [];
            for (const result of data.result) {
                resultArray.push(result);
            }
            this.setState({ results: resultArray });
        }).catch(error => {
            console.error(error);
            alert(error);
        });

    }

    render() {
        let r = document.querySelector(':root');
        r.style.setProperty('--editor-hint', '"SELECT * FROM ' + this.props.table + ';"');
        return (
            <div className='PageHolder'>
                <div className='QueryPage'>
                    <QueryEditor table={this.props.table} />
                    <div className='RunQuery' onClick={this.runQuery}>
                        Run Query
                    </div>
                    <div className='QueryResult'>
                        <table className='QueryResultTable' key={"QueryResult"}>
                            <thead>
                                {this.state.results[0] == null ? null : <ResultHeader content={this.state.results[0]} key={"Queryheaders"} />}
                            </thead>
                            <tbody>
                                {this.state.results.map((result, index) => <ResultRow content={result} key={"QueryRow_" + index} />)}
                            </tbody>
                            <tfoot>

                            </tfoot>
                        </table>
                    </div>
                </div>

            </div>
        );
    }
}

class ResultHeader extends React.Component {
    render() {
        let row = [];
        Object.keys(this.props.content).forEach(key => {
            row.push(
                <th data={key} key={"Header_" + key}>
                    {key}
                </th>
            );
        });
        return (
            <tr>
                {row}
            </tr>

        );
    }
}

class ResultRow extends React.Component {
    render() {
        let row = [];
        Object.keys(this.props.content).forEach(key => {
            row.push(
                <td data={key} key={key}>
                    {this.props.content[key]}
                </td>
            );
        });
        return (
            <tr>
                {row}
            </tr>
        );
    }
}

class QueryEditor extends React.Component {
    runHighlight = () => {
        document.getElementById("QueryHighlighted").innerHTML = Highlighter.getHighlighted(document.getElementById("QueryEditor").innerText);
    }

    render() {
        return (
            <div className='QueryEditor' spellCheck="false" onInput={this.runHighlight}>
                <div id="QueryEditor" contentEditable></div>
                <div className='QueryHighlighted' id='QueryHighlighted'></div>
                <div className='Hint'>{'SELECT * FROM ' + this.props.table + ';'}</div>
            </div>
        );
    }
}