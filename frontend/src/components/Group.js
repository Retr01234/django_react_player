import React, { Component } from "react";

export default class Group extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wantsToSkip: 0,
            pausible: false,
            owner: false,
        };

        this.groupIdentifier = this.props.match.params.groupIdentifier;
        this.groupDetails();
    }

    groupDetails() {
        fetch("/home/get-group" + "?identifier=" + this.groupIdentifier).then((response) => response.json())
        .then((data) => {
            this.setState({
                wantsToSkip: data.wants_to_skip,
                pausible: data.pausible,
                owner: data.owner,
            });
        });
    }

    render() {
        return (
            <div>
                <h4>{this.groupIdentifier}</h4>
                <p>Votes to Skip: {this.state.wantsToSkip}</p>
                <p>Pausable: {this.state.pausible.toString()}</p>
                <p>Owner: {this.state.owner.toString()}</p>
            </div>
        );
    }
}