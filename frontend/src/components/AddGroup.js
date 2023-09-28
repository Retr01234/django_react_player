import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export default class AddGroup extends Component {
    static defaultProps = {
        wantsToSkip: 0,
        pausible: true,
        edit: false,
        groupIdentifier: null,
        editCallback: () => {}
    }

    constructor(props) {
        super(props);

        this.state = {
            pausible: this.props.pausible,
            wantsToSkip: this.props.wantsToSkip,
            errorMessage: "",
            successMessage: "",
        };

        this.handleGroupBtnClicked = this.handleGroupBtnClicked.bind(this);
        this.handleVotes = this.handleVotes.bind(this);
        this.handlePausing = this.handlePausing.bind(this);
        this.handleEditBtnClicked = this.handleEditBtnClicked.bind(this);
    }

    handleVotes(event) {
        this.setState({
            wantsToSkip: event.target.value,
        });
    }

    handlePausing(event) {
        this.setState({
            pausible: event.target.value === "true" ? true : false,
        });
    }

    handleGroupBtnClicked() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                wants_to_skip: this.state.wantsToSkip,
                pausible: this.state.pausible,
            })
        };

        fetch("/backend/add-group", requestOptions)
            .then((response) => response.json())
            .then((data) => this.props.history.push("/group/" + data.identifier));
    }

    handleEditBtnClicked() {
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                wants_to_skip: this.state.wantsToSkip,
                pausible: this.state.pausible,
                groupIdentifier: this.props.groupIdentifier,
            }),
        };

        fetch("/backend/edit-group", requestOptions).then((response) => {
            if (response.ok) {
                this.setState({
                    successMessage: "Group Update Successful :)",
                });
            } else {
                this.setState({
                    errorMessage: "Cannot Update Group :/",
                });
            }
            this.props.editCallback();
        });
    }

    displayAddButton() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleGroupBtnClicked}>
                        Add a Group
                    </Button>
                </Grid>

                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" to="/" component={Link}>
                        return
                    </Button>
                </Grid>
            </Grid>
        );
    }

    displayEditButton() {
        return (
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleEditBtnClicked}>
                    Edit Group
                </Button>
            </Grid>
        );
    }

    render() {
        const header = this.props.edit ? "Edit Group" : "Add a Group";

        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Collapse in={this.state.errorMessage != "" || this.state.successMessage != ""}>
                        {this.state.successMessage != "" ? (
                            <Alert
                                severity="success"
                                onClose={() => {
                                    this.setState({ successMessage: "" });
                                }}
                            >
                                {this.state.successMessage}
                            </Alert>
                        ) : (
                            <Alert
                                severity="error"
                                onClose={() => {
                                    this.setState({ errorMessage: "" });
                                }}
                            >
                                {this.state.errorMessage}
                            </Alert>
                        )}
                    </Collapse>
                </Grid>

                <Grid item xs={12} align="center">
                    <Typography component="h2" variant="h2">
                        { header }
                    </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">Controls</div>
                        </FormHelperText>

                        <RadioGroup 
                            row 
                            defaultValue={this.props.pausible.toString()}
                            onChange={this.handlePausing}
                        >
                            <FormControlLabel
                                value="true"
                                control={<Radio color="primary" />}
                                label="Controls"
                                labelPlacement="bottom"
                            />

                            <FormControlLabel
                                value="false"
                                control={<Radio color="secondary" />}
                                label="No Control"
                                labelPlacement="bottom"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField
                            required={true}
                            type="number"
                            onChange={this.handleVotes}
                            defaultValue={this.wantsToSkip}
                            inputProps={{
                                min: 0,
                                style: { textAlign: "center" },
                            }}
                        />
                        <FormHelperText>
                            <div align="center">People Want to Skip</div>
                        </FormHelperText>
                    </FormControl>
                </Grid>

                {this.props.edit
                    ? this.displayEditButton()
                    : this.displayAddButton()
                }
            </Grid>
        );
    }
}