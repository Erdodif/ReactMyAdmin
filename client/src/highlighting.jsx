import React from "react";
import dictionary from "./dictionary.json";

export default class Highlighter {
    static getHighlighted(content) {
        this.Scope = new EditorScope();
        this.Scope.readScope(content);
        return this.Scope;
        //return content;
    }

}


class EditorScope {
    constructor(depth = 0, separator = " ") {
        this.level = depth;
        this.separator = separator
        this.components = [];
    }

    readScope(string) {
        if (string.match(/"{2,}/us)) {
            console.log("Empty String spotted!")
        }
        let regex = /("([\\].[^"]*)")|("[^\\"]*")|('([\\].[^']*)')|('[^']*')/gus
        let strings = string.match(regex);
        if(strings !== null){
            for (const match of strings){
                console.log(match);
            }
        }
        let components = string.replace(regex,"\\\"").split("\\\"");
        let out = <NoScript classes="script-static" content={components[0]}/>;
        for(let i = 1; i < components.length; i++){
            out += <NoScript classes="script-static" content={components[i]}/>;
        }
        console.log(out);
        return out;
    }
}

class NoScript extends React.Component{
    render(){
        return (<span className={this.props.classes}>{this.props.content}</span>);
    }
}

class EditorString {
    constructor(string) {
        this.content = string
    }
}