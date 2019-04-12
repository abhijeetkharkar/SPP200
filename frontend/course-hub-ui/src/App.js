import React, { Component } from 'react';
import './App.css';
import './css/common-components.css';
import CHNavigator from './js/CHNavigator'
import CHLandingContent from './js/CHLandingContent';
import LoginPage from './js/CHLogin';
import SignupPage from './js/CHSignup';
import ForgotPasswordPage from './js/CHForgotPassword';
import ProfilePage from "./js/CHProfile";
import CHFooter from './js/CHFooter';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey, faSignInAlt, faSearch, faAngleDown, faClock, faAt, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faMoneyCheckAlt, faWalking, faCalendar, faEye, faPencilAlt, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import firebaseInitialization from './FirebaseUtils';
import { searchUser } from './elasticSearch';

library.add(faEnvelope, faKey, faFacebookF, faGithub, faTwitter, faLinkedin,
  faSignInAlt, faSearch, faAngleDown, faClock, faAt, faExternalLinkAlt,
  faMoneyCheckAlt, faWalking, faCalendar, faEye, faPencilAlt, faThumbsUp, faThumbsDown);

class App extends Component {

  constructor() {
    super();
    this.state = {
      choice: "",
      firstName: "",
      email: "",
      searchString: ""
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
  }

  componentDidMount() {
    const self = this;
    firebaseInitialization.auth().onAuthStateChanged(user => self.handleAuthStateChange(user));
  }

  handleAuthStateChange = user => {
    if (user) {
      var email = user.email;
      var payloadSearch = {
        query: {
          term: { Email: email }
        }
      }
      searchUser(payloadSearch).then(firstName => {
        this.setState({
          choice: "homeSignedIn",
          firstName: firstName,
          email: email
        });
      });
    } else {
      this.setState({
        choice: "home"
      });
    }
  }

  handleClick = (choice, firstName, email, searchString) => {
    this.setState({ choice: choice,  firstName: firstName, email: email, searchString: searchString});
    /* this.setState({ optional1 });
    this.setState({ optional2 });
    this.setState({ optional3 }); */
  }

  render() {
    const choice = this.state.choice
    const firstName = this.state.firstName
    const email = this.state.email
    const searchString = this.state.searchString

    // console.log("In App, render function, email: ", email);

    const mainContainerStyle = { height: window.outerHeight };

    return (
      <div className="App container-fluid" style={mainContainerStyle}>
        {choice === "home" &&
          [<CHNavigator updateContent={this.handleClick} signedIn={false} caller={"app"} key="keyNavigatorLandingContent" />,
          <div className="my-content-landing" key="keyLandingContent">
            <CHLandingContent updateContent={this.handleClick} />
          </div>,
          <CHFooter key="keyFooterLandingContent" />]
        }

        {choice === "loginScreen" &&
          [<LoginPage updateContent={this.handleClick} key="keyLoginOverlayOnLandingContent" />,
          <CHNavigator updateContent={this.handleClick} signedIn={false} caller={"app"} key="keyNavigatorLoginOverlayOnLandingContent" />,
          <div className="my-content-landing" key="keyContentLoginOverlayOnLandingContent">
            <CHLandingContent updateContent={this.handleClick} />
          </div>,
          <CHFooter key="keyFooterLoginOverlayOnLandingContent" />]
        }

        {choice === "signupScreen" &&
          [<SignupPage updateContent={this.handleClick} key="keySignUpOverlayOnLandingContent" />,
          <CHNavigator updateContent={this.handleClick} signedIn={false} caller={"app"} key="keyNavigatorSignUpOverlayOnLandingContent" />,
          <div className="my-content-landing" key="keyContentSignUpOverlayOnLandingContent">
            <CHLandingContent updateContent={this.handleClick} />
          </div>,
          <CHFooter key="keyFooterSignUpOverlayOnLandingContent" />]
        }

        {choice === "forgotPasswordScreen" &&
          [<ForgotPasswordPage updateContent={this.handleClick} key="keyForgotPasswordOverlayOnLandingContent" />,
          <CHNavigator updateContent={this.handleClick} signedIn={false} caller={"app"} key="keyNavigatorForgotPasswordOverlayOnLandingContent" />,
          <div className="my-content-landing" key="keyContentForgotPasswordOverlayOnLandingContent">
            <CHLandingContent updateContent={this.handleClick} />
          </div>,
          <CHFooter key="keyFooterForgotPasswordOverlayOnLandingContent" />]
        }

        {choice === "homeSignedIn" &&
          [<CHNavigator updateContent={this.handleClick} signedIn={true} caller={"app"} firstName={firstName} email={email} key="keyNavigatorLandingContent" />,
          <div className="my-content-landing" key="keyLandingContent">
            <CHLandingContent updateContent={this.handleClick} signedIn={true} firstName={firstName} email={email} />
          </div>,
          <CHFooter key="keyFooterLandingContent" />]
        }

        {choice === "profile" &&
          this.props.history.push('/profile')
        }

        {choice === "searchResults" &&
          this.props.history.push('/search?searchString=' + searchString + "&pageNumber=0")}

        {choice === "deals" &&
          this.props.history.push('/deals')}



      </div>
    );
  }
}

export default App;