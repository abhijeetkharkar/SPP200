import React, { Component } from 'react';
import '../css/common-components.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Button } from 'react-bootstrap';
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
        } else {
            this.setState({ showResults: false });
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
        this.props.updateContent("searchResults", this.props.firstName, this.props.email, this.state.searchquery);
    }

    render() {
        const resultTableStyle = {display: this.state.showResults? "table": "none"};
        const formMarginStyle = {marginTop: window.innerHeight * 0.8 * 0.5};
        return (
            <Form className="landing-search-form" style={formMarginStyle} onSubmit={e => this.handleSearch(e)}>
                <div className="landing-search-form-div">
                    <input className="landing-search-box" placeholder="Search courses" value={this.state.searchquery} onChange={this.handlesearchqueryChange} type="text" />
                    <Button className="landing-search-button" type="submit"><FontAwesomeIcon className="landing-search-button-font" icon={['fa', 'search']} size='2x' /></Button>
                </div>
                <table className="landing-suggestions-table" style={resultTableStyle}>
                    <tbody>
                        {
                            this.state.suggestions.length > 0 ? 
                            this.state.suggestions.map((item, index) => {
                                return (<tr key={index}><td className="landing-suggestions-table-data" onClick={this.handleOnclick}>{item}</td></tr>);
                            }):
                            []
                        }
                    </tbody>
                </table>
            </Form>
        );
    }
}

export default CHLandingContent;