import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/common-components.css';
import { MDBCol, MDBBtn } from "mdbreact";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'react-bootstrap';
const fetch = require('node-fetch');

class CHLandingContent extends Component {

    constructor(props, context) {
        console.log("Autocomplete Constructor")
        super(props, context);
        this.handlesearchqueryChange = this.handlesearchqueryChange.bind(this);
        this.state = {
            searchquery: "",
            suggestions: "",
            searched: false
        };
    }

    handlesearchqueryChange = event => {
        event.preventDefault();
        this.setState({ searchquery: event.target.value })
        const searchterm = this.state.searchquery
        console.log("CHSearch HandleSubmit", searchterm);
        const url = process.env.REACT_APP_AUTOCOMPLETE_EP + searchterm
        fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({ suggestions: data['suggestions'], searched: true });
        }).catch(e => {
            console.log('error ', e);
        });
        console.log('state response ', this.state.suggestions);
    }

    render() {
        var suggestionResults;
        if (this.state.suggestions.length > 0 && this.state.searchquery.length > 2) {
            return (
                <MDBCol md="7">
                    <div className="input-group md-form form-sm form-1 pl-0" id="landingdiv">
                        <div className="autocompleteclass" id="autocomplete">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-text1">
                                    <FontAwesomeIcon icons="search" color='rgb(207, 204, 19)' size='3x' />
                                </span>
                            </div>
                            <input className="form-control my-0 py-1" value={this.state.searchquery} onChange={this.handlesearchqueryChange} type="text" placeholder="Search courses" aria-label="Search" />

                            <ul>
                                {this.state.suggestions.map((item, index) => {
                                    return (<p key={index}>{item}</p>);
                                })}
                            </ul>
                        </div>
                        <MDBBtn size="lg">Search</MDBBtn>
                    </div>
                </MDBCol>
            );
        }
        return (
            <MDBCol md="7">
                <div className="input-group md-form form-sm form-1 pl-0">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-text1">
                            <FontAwesomeIcon icons="search" color='rgb(207, 204, 19)' size='3x' />
                        </span>
                    </div>
                    <input className="form-control my-0 py-1" value={this.state.searchquery} onChange={this.handlesearchqueryChange} type="text" placeholder="Search courses" aria-label="Search" />
                    <MDBBtn size="lg">Search</MDBBtn>
                </div>
            </MDBCol>
        );
    }
}

export default CHLandingContent;