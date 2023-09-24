import React, { Component } from "react";
import EnterGroup from "./EnterGroup";
import AddGroup from "./AddGroup";
import Group from "./Group";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/"><h1>Home page</h1></Route>
                    <Route path="/group/:groupIdentifier" component={Group} />
                    <Route path="/enter" component={EnterGroup} />
                    <Route path="/add" component={AddGroup} />
                </Switch>
            </Router>
        );
    }
}