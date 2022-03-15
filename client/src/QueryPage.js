import './QueryPage.scss';
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
const CORS_HEADERS_POST = (body) => {
    return {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        headers: {
            'Accept': 'application/json'
        },
        body: body
    }
};

export default class QueryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            query:''
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
    }

    fillQueryResults() {
        let url = this.props.url + "/" + this.props.database + "/" + this.props.table;
        fetch(url, CORS_HEADERS_POST(this.state.query)).then(response => {
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

    render() {
        return (
            <div className='QueryPage'>
                <textarea className='QueryEditor' placeholder={'SELECT * FROM ' + this.props.table}>
                </textarea>
                <table className='QueryResult' key={"QueryResult"}>
                    <thead>

                    </thead>
                    <tbody>
                        {this.state.results.map((result, index) => <ResultRow content={result} key={"QueryRow_" + index} />)}
                    </tbody>
                    <tfoot>

                    </tfoot>
                </table>

            </div>
        );
    }
}

class ResultHeader extends React.Component {

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
            <tr key="">
                {row}
            </tr>

        );
    }

}
