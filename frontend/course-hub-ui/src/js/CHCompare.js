import React, { Component } from 'react';
import queryString from 'query-string';
import '../App.css';
import '../css/common-components.css';
import '../css/search.css';
import CHNavigator from './CHNavigator';
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';
import { searchUser } from '../elasticSearch';
import CHCompareContent from "./CHCompareContent";
import ProfilePage from "./CHSearch";

const fetch = require('node-fetch');

class CHCompare extends Component {

    constructor(props, context) {
        super(props, context); 
        this.state = {
            choice: '',
            firstName: '',
            email: '',
        }
        this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
    }

    componentWillMount() {
        const self = this;
        firebaseInitialization.auth().onAuthStateChanged(user => self.handleAuthStateChange(user));
    }

    handleClick = (choice, firstName, email, queryString) => {
        this.setState({ choice: choice, firstName: firstName, email: email, queryString: queryString});
    };

    handleAuthStateChange = user => {
        if (user) {
            var email = user.email;
            var payloadSearch = {
                query: {
                    term: { Email: email }
                }
            }
            searchUser(payloadSearch).then(first => {
                this.setState({
                    choice: "homeSignedIn",
                    firstName: first,
                    email: email
                });
            });
        } else {
            this.setState({
                choice: "home"
            });
        }
    }

    render() {
        const choice = this.state.choice;
		const firstName = this.state.firstName;
        const email = this.state.email;

        return(
        <div className="course_compare">
            {choice === "home" &&
                [<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"search"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
                    <CHCompareContent updateContent={this.handleClick}/>,
                <CHFooter key="keyFooterSearch" />]
            }
            {choice === "homeSignedIn" &&
                [<CHNavigator updateContent={this.handleClick} signedIn={firstName != null} caller={"search"} firstName={firstName} email={email} key="keyNavigatorSearch" />,
                    <CHCompareContent updateContent={this.handleClick}/>,
                <CHFooter key="keyFooterSearch" />]
            }
            {choice === "profile" &&
                this.props.history.push('/profile')
            }
            {
                choice === "coursedetails" && this.props.history.push('/course?courseId=' + this.state.queryString )
            }

        </div>
        );
    }
}

export default CHCompare;