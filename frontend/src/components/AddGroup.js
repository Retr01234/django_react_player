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

export default class AddGroup extends Component {
    standardNrOfVotes = 0;

    constructor(props) {
        super(props);
        this.state = {
            pausible: true,
            wantsToSkip: this.standardNrOfVotes
        };

        this.handleGroupBtnClicked = this.handleGroupBtnClicked.bind(this);
        this.handleVotes = this.handleVotes.bind(this);
        this.handlePausing = this.handlePausing.bind(this);
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

    render() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography component="h2" variant="h2">
                        Add A Group
                    </Typography>
                </Grid>

                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">Controls</div>
                        </FormHelperText>

                        <RadioGroup row defaultValue="true" onChange={this.handlePausing}>
                            <FormControlLabel
                                value="true"
                                control={<Radio color="primary" />}
                                label="Play/Pause"
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
                            defaultValue={this.standardNrOfVotes}
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

                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" size="large" onClick={this.handleGroupBtnClicked}>
                        Add a Group
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