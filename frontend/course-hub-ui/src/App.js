import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './App.css';
import './css/bootstrap.min.css';
import CHNavigator from './js/CHNavigator'
import CHLandingContent from './js/CHLandingContent';
import LoginPage from './js/CHLogin';
import SignupPage from './js/CHSignup';
import CHFilters from './js/CHFilters';
import CHRightLane from './js/CHRightLane';
import CHFooter from './js/CHFooter';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey, faSignInAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
// import GoogleLogin from 'react-google-login';

library.add(faEnvelope, faKey, faFacebookF, faGithub, faTwitter, faLinkedin, faSignInAlt, faSearch);


class App extends Component {

  constructor() {
    super();
    this.state = {
      choice: "home",
      optional1: "",
      optional2: "",
      optional3: ""
    };
    this.handleClick = this.handleClick.bind(this);
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
          [<CHNavigator updateContent={this.handleClick} />,
          <div className="container-landing my-content-landing">
            <CHLandingContent />
          </div>,
          <CHFooter />]
        }

        {choice === "loginScreen" &&
          [<LoginPage updateContent={this.handleClick} />,
          <CHNavigator updateContent={this.handleClick} />,
          <div className="container-landing my-content-landing">
            <CHLandingContent />
          </div>,
          <CHFooter />]
        }
        {choice === "signupScreen" &&
          [<SignupPage updateContent={this.handleClick} />,
          <CHNavigator updateContent={this.handleClick} />,
          <div className="container-landing my-content-landing">
            <CHLandingContent />
          </div>,
          <CHFooter />]
        }
      </div>
    );
  }
}

export default App;
