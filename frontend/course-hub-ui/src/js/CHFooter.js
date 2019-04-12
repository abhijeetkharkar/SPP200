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

					<a href="#"><FontAwesomeIcon icon={['fab', 'facebook-f']} color='rgb(207, 204, 19)' /></a>
					<a href="#"><FontAwesomeIcon icon={['fab', 'twitter']} color='rgb(207, 204, 19)' /></a>
					<a href="#"><FontAwesomeIcon icon={['fab', 'linkedin']} color='rgb(207, 204, 19)' /></a>
					<a href="https://github.com/UIOWA5830SP19/SPP200" target="_blank"><FontAwesomeIcon icon={['fab', 'github']} color='rgb(207, 204, 19)' /></a>

				</div>

				<div className="footer-left">

					<p className="footer-links">
						<a href="/">Home</a>
							·
						<a href="#">Blog</a>
							·
						<a href="#">About</a>
							·
						<a href="#">FAQ</a>
							·
						<a href="#">Contact</a>
					</p>

					<p>Course-Hub &copy; 2019</p>
				</div>

			</div>
		);
	}
}

export default CHNavigator;