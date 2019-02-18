import React, { Component } from 'react';
import './App.css';
import './css/bootstrap.min.css';
import CHNavigator from './js/CHNavigator'
import CHLandingContent from './js/CHLandingContent';
import CHFilters from './js/CHFilters';
import CHRightLane from './js/CHRightLane';
import CHFooter from './js/CHFooter';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey, faSignInAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

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

  handleClick = (choice, optional1, optional2, optional3) => { this.setState({ choice }); this.setState({ optional1 }); this.setState({ optional2 }); this.setState({ optional3 }) }

  render() {
    return (
      <div className="App container-fluid">
        <CHNavigator updateContent={this.handleClick} />
        {/* <CHFilters />
        <CHRightLane /> */}
        <div className="container-landing my-content-landing">
          <CHLandingContent />
        </div>
        <CHFooter />
      </div>
    );
  }
}

export default App;
