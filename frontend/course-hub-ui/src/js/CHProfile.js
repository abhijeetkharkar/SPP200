import React, { Component } from 'react';
import '../App.css';
import '../css/common-components.css';
import '../css/profile.css';
import CHNavigator from './CHNavigator';
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';
import { searchUser } from '../elasticSearch';
import ProfileContent from "./CHProfileContent";

const fetch = require('node-fetch');

class CHProfile extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            choice: '',
            firstName: '',
            email: '',
            queryString: '',
        };
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
            };
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
    };

    render() {
        const choice = this.state.choice;
        const firstName = this.state.firstName;
        const email = this.state.email;

        return(
            <div className="profile">

                {
                    choice === "home" && this.props.history.push('/')
                }

                {
                    (choice === "profile" || choice === "homeSignedIn" ) &&
                        [
                            <CHNavigator updateContent={this.handleClick} signedIn={true} caller={"profile"} firstName={firstName} email={email} key="keyNavigatorLandingContent" />,
                            <div className="profile-content" key="keyLandingContent">
                                <ProfileContent updateContent={this.handleClick} email={email} />
                            </div>,
                            <CHFooter key="keyFooterLandingContent" />,
                        ]
                }

                {
                    choice === "coursedetails" && this.props.history.push('/course?courseId=' + this.state.queryString )
                }                				

				{	
					choice === "deals" && this.props.history.push('/deals')
        		}

				{	
					choice === "microdegree" && this.props.history.push('/microdegree')
				}

            </div>
        );
    }
}

export default CHProfile;