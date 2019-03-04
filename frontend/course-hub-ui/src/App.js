import React, { Component } from 'react';
import './App.css';
import './css/bootstrap.min.css';
import CHNavigator from './js/CHNavigator'
import CHLandingContent from './js/CHLandingContent';
import LoginPage from './js/CHLogin';
import SignupPage from './js/CHSignup';
import ForgotPasswordPage from './js/CHForgotPassword';
import CHFooter from './js/CHFooter';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey, faSignInAlt, faSearch, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import firebaseInitialization from './FirebaseUtils';
import app from 'firebase/app';
import ProfilePage from "./js/CHProfile";
import ProfileNavigator from "./js/CHProfileNavigator";
import {searchUser} from './elasticSearch';

library.add(faEnvelope, faKey, faFacebookF, faGithub, faTwitter, faLinkedin, faSignInAlt, faSearch, faAngleDown);

class App extends Component {

  constructor() {
    super();
    this.state = {
      choice: "",
      optional1: "",
      optional2: "",
      optional3: ""
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    firebaseInitialization.auth().onAuthStateChanged(user => {
      if (user) {
        /* this.setState({
          choice: "homeSignedIn",
        }); */
        var email = user.email;
        var payloadSearch = {
          query : {
              term : { Email : email }
          }
        }
        searchUser(payloadSearch).then(firstName => {
          this.setState({
            choice: "homeSignedIn",
            optional1: firstName,
            optional2: email
          });
        });
      } else {
        this.setState({
          choice: "home"
        });
      }
    });
  }

  handleClick = (choice, optional1, optional2, optional3) => {
    this.setState({ choice });
    this.setState({ optional1 });
    this.setState({ optional2 });
    this.setState({ optional3 });
  }

  render() {
    const choice = this.state.choice
    const optional1 = this.state.optional1
    const optional2 = this.state.optional2
    const optional3 = this.state.optional3
    return (
      <div className="App container-fluid">
        {choice === "home" &&
          [<CHNavigator updateContent={this.handleClick} signedIn={false} key="keyNavigatorLandingContent"/>,
          <div className="container-landing my-content-landing"  key="keyLandingContent">
            <CHLandingContent />
          </div>,
          <CHFooter key="keyFooterLandingContent"/>]
        }

        {choice === "loginScreen" &&
          [<LoginPage updateContent={this.handleClick} key="keyLoginOverlayOnLandingContent"/>,
          <CHNavigator updateContent={this.handleClick} signedIn={false} key="keyNavigatorLoginOverlayOnLandingContent"/>,
          <div className="container-landing my-content-landing" key="keyContentLoginOverlayOnLandingContent">
            <CHLandingContent />
          </div>,
          <CHFooter key="keyFooterLoginOverlayOnLandingContent"/>]
        }

        {choice === "signupScreen" &&
          [<SignupPage updateContent={this.handleClick} key="keySignUpOverlayOnLandingContent"/>,
          <CHNavigator updateContent={this.handleClick} signedIn={false} key="keyNavigatorSignUpOverlayOnLandingContent"/>,
          <div className="container-landing my-content-landing" key="keyContentSignUpOverlayOnLandingContent">
            <CHLandingContent />
          </div>,
          <CHFooter key="keyFooterSignUpOverlayOnLandingContent"/>]
        }

        {choice === "forgotPasswordScreen" &&
          [<ForgotPasswordPage updateContent={this.handleClick} key="keyForgotPasswordOverlayOnLandingContent"/>,
          <CHNavigator updateContent={this.handleClick} signedIn={false} key="keyNavigatorForgotPasswordOverlayOnLandingContent"/>,
          <div className="container-landing my-content-landing" key="keyContentForgotPasswordOverlayOnLandingContent">
            <CHLandingContent />
          </div>,
          <CHFooter key="keyFooterForgotPasswordOverlayOnLandingContent"/>]
        }

        {choice === "homeSignedIn" &&
          [<CHNavigator updateContent={this.handleClick} signedIn={true} firstName={optional1} email={optional2} key="keyNavigatorLandingContent"/>,
          <div className="container-landing my-content-landing"  key="keyLandingContent">
            <CHLandingContent />
          </div>,
          <CHFooter key="keyFooterLandingContent"/>]
        }

        {choice === "profile" &&
        [<CHNavigator updateContent={this.handleClick} signedIn={true} firstName={optional1} email={optional2} key="keyNavigatorLandingContent"/>,
          <div className="container-landing profile-content"  key="keyLandingContent">
            <ProfileNavigator/>
            <ProfilePage updateContent={this.handleClick} email={optional2}/>
          </div>,
          <CHFooter key="keyFooterLandingContent"/>]
        }
      </div>
    );
  }
}

export default App;