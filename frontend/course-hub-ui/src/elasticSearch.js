import React from 'react';

const fetch = require("node-fetch");
// var elasticsearch = require('elasticsearch');

const addUser = payload => {
    console.log("in add user")
    fetch(process.env.REACT_APP_AWS_ELASTIC_ADD_URL + "users/user", { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } }).then(response => {
		return response.json();
	}).then(elasticData => {
		if (elasticData.result === "created") {
			return true
		} else {
			return false
		}
	}).catch(error => {
		console.log(error.message);
	});
}


export default addUser;
// export {searchUser};