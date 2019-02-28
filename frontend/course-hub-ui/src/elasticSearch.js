const fetch = require("node-fetch");

const addUser = async payload => {
	console.log("in add user")
	const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_ADD_URL + "users/user", 
			{ 
				method: 'POST', 
				body: JSON.stringify(payload), 
				headers: { 'Content-Type': 'application/json' 
			} 
	}).then(response => {
		return response.json();
	}).then(elasticData => {
		if (elasticData.result === "created") {
			return true;
		} else {
			return false;
		}
	}).catch(error => {
		return false;
	});
	return response;
}

//TODO fix searchUser. It is just a copy paste presently
const searchUser = async payload => {
	console.log("in add user")
	const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_ADD_URL + "users/user", 
			{ 
				method: 'POST', 
				body: JSON.stringify(payload), 
				headers: { 'Content-Type': 'application/json' 
			} 
	}).then(response => {
		return response.json();
	}).then(elasticData => {
		if (elasticData.result === "created") {
			return true;
		} else {
			return false;
		}
	}).catch(error => {
		return false;
	});
	return response;
}

export {addUser, searchUser};