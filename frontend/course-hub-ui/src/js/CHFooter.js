import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/common-components.css';
// import '../css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CHNavigator extends Component {
	render() {
		return (
			<div className="footer-distributed">

				<div className="footer-right">

					<a href="#"><FontAwesomeIcon icon={['fab', 'facebook-f']} color='#4494ff' /></a>
					<a href="#"><FontAwesomeIcon icon={['fab', 'twitter']} color='#4494ff' /></a>
					<a href="#"><FontAwesomeIcon icon={['fab', 'linkedin']} color='#4494ff' /></a>
					<a href="https://github.com/UIOWA5830SP19/SPP200" target="_blank"><FontAwesomeIcon icon={['fab', 'github']} color='#4494ff' /></a>

				</div>

				<div className="footer-left">

					<p className="footer-links">
						<a href="/">Home</a>
							&nbsp;·&nbsp;
						<a href="#">About</a>
							&nbsp;·&nbsp;
						<a href="#">Contact</a>
					</p>

					<p>Course-Hub &copy; 2019</p>
				</div>

			</div>
		);
	}
}

export default CHNavigator;