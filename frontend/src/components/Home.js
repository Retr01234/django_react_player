import React, { Component } from "react";
import EnterRoom from "./EnterRoom";
import AddRoom from "./AddRoom";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/"><p>Home page</p></Route>
                    <Route path="/enter" component={EnterRoom} />
                    <Route path="/add" component={AddRoom} />
                    </Switch>
            </Router>
        );
    }
}