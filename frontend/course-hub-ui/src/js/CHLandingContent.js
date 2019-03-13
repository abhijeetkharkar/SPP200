import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/common-components.css';
import { MDBCol, MDBBtn, MDBContainer, MDBRow } from "mdbreact";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form } from 'react-bootstrap';
const fetch = require('node-fetch');


class CHLandingContent extends Component {

    constructor(props, context) {
        // console.log("Autocomplete Constructor")
        super(props, context);
        this.handlesearchqueryChange = this.handlesearchqueryChange.bind(this);
        this.handleOnclick = this.handleOnclick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.state = {
            searchquery: "",
            suggestions: "",
            searched: false,
            showResults: false
        };
    }

    handlesearchqueryChange = event => {
        event.preventDefault();
        const self = this;
        this.setState({ searchquery: event.target.value });
        const searchterm = this.state.searchquery;
        if(searchterm.length > 2) {
            this.setState({ searchquery: event.target.value, showResults: true });
            const url = process.env.REACT_APP_AUTOCOMPLETE_EP + searchterm
            fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                self.setState({ suggestions: data['suggestions'], searched: true });
            }).catch(e => {
                // console.log('error ', e);
            });
        }    
        // console.log('state response ', this.state.suggestions);
    }

    handleOnclick = event => {
        event.preventDefault();
        // document.getElementById("searchbox").value = event.target.innerText;
        // document.getElementById("autocomplete").style.display = "none";
        this.setState({searchquery: event.target.innerText, showResults: false});
    }

    handleSearch = event => {
        event.preventDefault();
        // console.log(event.target);
        // console.log("CHLAndingContent, inside handleSearch:: searchQuery:", this.state.searchquery);
        this.props.updateContent(this.props.email != null? "searchResultsSignedIn":"searchResultsNotSignedIn", this.props.firstName, this.props.email, this.state.searchquery);
    }

    render() {
        const resultDivStyle = {display: this.state.showResults? "block": "none"};
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="12">
                        <Form onSubmit={e => this.handleSearch(e)}>
                            <div className="input-group md-form form-sm form-1 pl-0" id="landingdiv">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-text1">
                                        <FontAwesomeIcon icon={['fa', 'search']} color='rgb(207, 204, 19)' size='3x' />
                                    </span>
                                </div>
                                <input id="searchbox" className="form-control my-0 py-1" value={this.state.searchquery} onChange={this.handlesearchqueryChange} type="text" placeholder="Search courses" aria-label="Search" />
                                <MDBBtn size="lg" className="searchbutton" type="submit">Search</MDBBtn>
                            </div>
                            <div className="autocompleteclass" id="autocomplete" style={resultDivStyle}>
                                <table className="suggestions-table">
                                    <tbody>
                                        {
                                            this.state.suggestions.length > 0 ? 
                                            this.state.suggestions.map((item, index) => {
                                                return (<tr key={index}><td className="suggestions-data" onClick={this.handleOnclick}>{item}</td></tr>);
                                            }):
                                            []
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </Form>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}

export default CHLandingContent;