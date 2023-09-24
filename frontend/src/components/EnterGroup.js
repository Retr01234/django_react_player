import React, { Component } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Grid, Typography } from "@material-ui/core";

export default class EnterGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupIdentifier: "",
            error: "",
        };

        this.textField = this.textField.bind(this);
        this.groupBtnCLicked = this.groupBtnCLicked.bind(this);
    }

    textField(event) {
        this.setState({
            groupIdentifier: event.target.value,
        });
    }

    groupBtnCLicked() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                identifier: this.state.groupIdentifier,
            }),
        };

        fetch("/home/enter-group", requestOptions)
            .then((response) => {
                if (response.ok) {
                    this.props.history.push(`/group/${this.state.groupIdentifier}`);
                } else {
                    this.setState({ error: "Group was not found." });
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h2" component="h2">
                        Enter a Group
                    </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <TextField
                        error={this.state.error}
                        label="Identifier"
                        placeholder="Enter a Group Id"
                        value={this.state.groupIdentifier}
                        helperText={this.state.error}
                        variant="outlined"
                        onChange={this.textField}
                    />
                </Grid>

                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" size="large" onClick={this.groupBtnCLicked}>
                        Enter this Group
                    </Button>
                </Grid>

                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" size="large" to="/" component={Link}>
                        Go Back
                    </Button>
                </Grid>
            </Grid>
        );
    }
}