import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/common-components.css';
import '../css/about-contact.css';
import CHNavigator from './CHNavigator';
import CHFooter from './CHFooter';
import firebaseInitialization from '../FirebaseUtils';
import {searchUser} from '../elasticSearch';

class CHAboutContact extends Component {

    constructor(props) {
		super(props);
		this.state = {
		    user_id: null,
			choice: '',
			firstName: null,
			email: null
		};
		
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
		const choice = this.state.choice
		const firstName = this.state.firstName
		const email = this.state.email
        const customStyle = {
            height: "75vh",
            marginTop: window.outerHeight * 0.11
        }
        return (
            <div className="App container-fluid">
				<CHNavigator signedIn={email != null} caller={"app"} firstName={firstName} email={email} key="keyNavigatorSearch" />
				<div className="my-content-landing" key="keyAboutContact">
					<div id="about-contact-div" className="about-contact" style={customStyle}>
						<h2>About Course-Hub</h2>
						<p className="about-paragraph">
							The core idea of the project is to make a platform for comparing courses under one roof 
							and save users the trouble of browsing different sites to check and compare the quality 
							and prices of similar courses. In addition, we plan to build additional features like 
							allowing users to post good deals available on different online course websites, thus, spreading the news.
						</p>
						<p className="about-paragraph">
							As a student, you are sometimes not attentive in classes, miss classes or sometimes, your professors 
							may not be as good or you would be wanting the learn a new technology. Then, you browse through 
							different websites for online courses, put in efforts to compare courses based on different factors, 
							ask for inputs from friends and then lock down a certain course from a certain provider. 
							This process is time-consuming. Course-Hub plans to considerably reduce these efforts 
							and in today's world which is moving towards online learning, as it is much cheaper to gain 
							knowledge learning online than paying college tuitions, a one-stop-shop for comparing online 
							learnings is a need.
						</p>
						<br/>
						<h2>
							Contact Us
						</h2>
						<p className="contact-paragraph">
							Team Course-Hub,<br/>
							4316 Seamans Center,<br/>
							Iowa City, IA 52240.
						</p>
						<a className="mail-to" href="mailto:cousehubuiowa@gmail.com">Mail</a>
					</div>
				</div>
				<CHFooter key="keyFooterSearch" />
            </div>
        );
    }
}

export default CHAboutContact;
