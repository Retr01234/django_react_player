import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import AddGroup from "./AddGroup";

export default class Group extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wantsToSkip: 0,
            pausible: false,
            owner: false,
            editFields: false,
            isSpotifyAuthorized: false
        };

        this.groupIdentifier = this.props.match.params.groupIdentifier;
        this.exitGroupBtnClicked = this.exitGroupBtnClicked.bind(this);
        this.editFieldData = this.editFieldData.bind(this);
        this.displayEditBtn = this.displayEditBtn.bind(this);
        this.showUpdatedFields = this.showUpdatedFields.bind(this);
        this.groupDetails = this.groupDetails.bind(this);
        this.authorizeSpotify = this.authorizeSpotify.bind(this);
        this.groupDetails();
    }

    groupDetails() {
        return fetch("/backend/get-group" + "?identifier=" + this.groupIdentifier)
            .then((response) => {
                if (!response.ok) {
                    this.props.exitGroupCallback();
                    this.props.history.push("/");
                }

            return response.json();
        })
        .then((data) => {
            this.setState({
                wantsToSkip: data.wants_to_skip,
                pausible: data.pausible,
                owner: data.owner,
            });

            if (this.state.owner) {
                this.authorizeSpotify();
            }
        });
    }

    authorizeSpotify() {
        fetch("/spotify/authorized").then((response) => response.json()).then((data) => {
            this.setState({ isSpotifyAuthorized: data.status });

            if (!data.status) {
                fetch("/spotify/get-verified-url").then((response) => response.json()).then((data) => {
                    window.location.replace(data.url);
                });
            }
        });
    }

    exitGroupBtnClicked() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch("/backend/exit-group", requestOptions).then((_response) => {
            this.props.exitGroupCallback();
            this.props.history.push("/");
        });
    }

    editFieldData(value) {
        this.setState({
            editFields: value,
        });
    }

    showUpdatedFields() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <AddGroup
                        edit={true}
                        wantsToSkip={this.state.wantsToSkip}
                        pausible={this.state.pausible}
                        groupIdentifier={this.groupIdentifier}
                        editCallback={this.groupDetails}
                    />
                </Grid>

                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => this.editFieldData(false)}>
                        Exit
                    </Button>
                </Grid>
            </Grid>
        );
    }

    displayEditBtn() {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => this.editFieldData(true)}>
                    Edit Fields
                </Button>
            </Grid>
        );
    }

    render() {
        if (this.state.editFields) {
            return this.showUpdatedFields();
        }

        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Group ID: {this.groupIdentifier}
                    </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Votes to Skip: {this.state.wantsToSkip}
                    </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Pausable: {this.state.pausible.toString()}
                    </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Owner: {this.state.owner.toString()}
                    </Typography>
                </Grid>

                {this.state.owner ? this.displayEditBtn() : null}

                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={this.exitGroupBtnClicked}>
                        Exit Group
                    </Button>
                </Grid>
            </Grid>
        );
    }
}