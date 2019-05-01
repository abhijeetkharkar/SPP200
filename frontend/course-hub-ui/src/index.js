import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CHSearch from './js/CHSearch';
import CHCourseDetails from './js/CHCourseDetails';
import CHDeals from './js/CHDeals';
import CHMicroDegree from './js/CHMicroDegree';
import CHAboutContact from './js/CHAboutContact';
import * as serviceWorker from './serviceWorker';
import 'babel-polyfill';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CHCompare from "./js/CHCompare";
import CHProfile from "./js/CHProfile";

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={App}/>
			<Route path="/search" component={CHSearch}/>
			<Route path="/course" component={CHCourseDetails}/>
			<Route path="/deals" component={CHDeals}/>
			<Route path="/compare" component={CHCompare}/>
			<Route path="/profile" component={CHProfile}/>
			<Route path="/microdegree" component={CHMicroDegree}/>
			<Route path="/about" component={CHAboutContact}/>
		</Switch>
    </BrowserRouter>, 
	document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
