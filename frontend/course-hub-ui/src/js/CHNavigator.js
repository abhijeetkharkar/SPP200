import React, { Component } from 'react';
import '../css/common-components.css';
import '../css/navigator.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dropdown, Image, Form } from 'react-bootstrap';
import {doSignOut} from '../FirebaseUtils';

class CHNavigator extends Component {

    constructor(props, context) {
        super(props, context);
        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleViewProfile = this.handleViewProfile.bind(this);
        this.handleSearchStringChange = this.handleSearchStringChange.bind(this);
        this.handleOnclick = this.handleOnclick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.state = {
            searchString: "",
            suggestions: "",
            searched: false,
            showResults: false
        };
    }

    componentWillReceiveProps() {
        // console.log("In CHNavigator, componentWillReceiveProps");
        this.setState({ showResults: false });
    }

    handleSignOut = e => {
        const self = this;
        doSignOut().then( () => {
            self.props.updateContent("home", null, null, null);
        }).catch(function (error) {
            // TODO Deal with this. Have an alert sent to some system to assist user.
            console.log(error);
        });
    }

    handleViewProfile = e => {
        this.props.updateContent("profile", this.props.firstName, this.props.email, null);
    }

    handleOnclick = event => {
        event.preventDefault();
        this.setState({searchString: event.target.innerText, showResults: false});
    }

    handleSearchStringChange = event => {
        event.preventDefault();
        const self = this;
        this.setState({ searchString: event.target.value });
        const searchterm = this.state.searchString;
        if(searchterm.length > 2) {
            this.setState({ searchString: event.target.value, showResults: true });
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

    handleSearch = event => {
        event.preventDefault();
        this.props.updatePage(this.state.searchString, 0);
    }

    render() {
        const resultTableStyle = {display: this.state.showResults? "table": "none"};
        const logoStyle = {
            float: this.props.caller === "app"? "inherit": "left",
            height: this.props.caller === "app"? "90%": "60%",
            marginTop: this.props.caller === "app"? "auto": "1%",
            maxWidth: "100%"
        };
        const headerHeightStyle = {height: window.outerHeight * 0.1}
        return (
            <div id="homeHeader" style={headerHeightStyle}>
                <a href='/'>
                    {/* <h1 className="website-name">Course-Hub</h1> */}
                    <Image style={logoStyle} className="website-logo" src="https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/Course_Hub_Transparent_Background.png?alt=media&token=7932c4fe-54d6-4802-9ab6-8e12fc359cb9"/>
                </a>
                {
                    this.props.caller !== "app" &&                    
                    <Form className="search-results-search-form" onSubmit={e => this.handleSearch(e)}>
                        <input className="search-results-search-box" placeholder="Search courses" value={this.state.searchString} onChange={this.handleSearchStringChange} type="text" />
                        <Button className="search-results-search-button" type="submit"><FontAwesomeIcon className="search-results-search-button-font" icon={['fa', 'search']} size='sm' /></Button>
                        <table className="search-results-suggestions-table" style={resultTableStyle}>
                            <tbody>
                                {
                                    this.state.suggestions.length > 0 ? 
                                    this.state.suggestions.map((item, index) => {
                                        return (<tr key={index}><td className="search-results-suggestions-table-data" onClick={this.handleOnclick}>{item}</td></tr>);
                                    }):
                                    []
                                }
                            </tbody>
                        </table>
                    </Form>
                    
                }
                <div id="website-navigators-container">
                    {!this.props.signedIn &&
                        <Button id="loginButtonNavigator" className="my-nav-tabs" onClick={(e) => this.props.updateContent("loginScreen", null, null, null)}>
                            <FontAwesomeIcon icon="sign-in-alt" />
                            &nbsp;&nbsp;Login/Signup
                        </Button>
                    }

                    {this.props.signedIn &&
                        <Dropdown>
                            <Dropdown.Toggle className="my-nav-tabs" id="signedInOptions">
                                Hello, {this.props.firstName?this.props.firstName:"Jon Snow"}&nbsp;&nbsp;
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={this.handleViewProfile}>View Profile</Dropdown.Item>
                                <Dropdown.Item onClick={this.handleSignOut}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                    <Button className="my-nav-tabs">Deals</Button>
                </div>
            </div>
        );
    }
}

export default CHNavigator;