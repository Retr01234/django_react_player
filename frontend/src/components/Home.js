import React, { Component } from "react";
import EnterGroup from "./EnterGroup";
import AddGroup from "./AddGroup";
import Group from "./Group";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Grid, Typography, ButtonGroup, Button, AppBar, Toolbar } from '@material-ui/core';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupIdentifier: null,
        };
        this.resetGroupID = this.resetGroupID.bind(this);
    }

    async componentDidMount() {
        fetch("/backend/person-in-group").then((response) => response.json()).then((data) => {
            this.setState({
                groupIdentifier: data.identfier,
            });
        });
    }

    resetGroupID() {
        this.setState({
            groupIdentifier: null,
        });
    }

    displayMainPage() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                    <Typography variant="h6">Rythmix Music Player</Typography>
                    </Toolbar>
                </AppBar>

                <Grid container spacing={3}>
                    <Grid item xs={12} align="center">
                        <Typography variant="h4">
                            Welcome to the ultimate music experience!
                        </Typography>
                    </Grid>

                    <Grid item xs={12} align="center">
                        <ButtonGroup disableElevation variant="contained">
                            <Button
                                color="primary"
                                size="large"
                                component={Link}
                                to="/enter"
                                style={{ backgroundColor: '#FF5733' }}
                            >
                                Enter a Music Group
                            </Button>

                            <Button
                                color="secondary"
                                size="large"
                                component={Link}
                                to="/add"
                                style={{ backgroundColor: '#33FF57' }}
                            >
                                Add a Music Group
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>

                <footer style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Typography variant="body2">
                        &copy; {new Date().getFullYear()} Rythmix Music Player. All rights reserved.
                    </Typography>
                </footer>
            </div>
        );
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={() => {
                        return this.state.groupIdentifier ? (
                            <Redirect to={`/group/${this.state.groupIdentifier}`} />
                        ) : (this.displayMainPage());
                        }}
                    />
                    <Route path="/enter" component={EnterGroup} />
                    <Route path="/add" component={AddGroup} />
                    <Route path="/group/:groupIdentifier" render={(props) => {
                        return <Group {...props} exitGroupCallback={this.resetGroupID} />;
                    }}/>
                </Switch>
            </Router>
        );
    }
}