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
		if (response.result === "created") {
			return true;
		} else {
			return false;
		}
	}).catch(error => {
		return false;
	});
	return response;
}

const searchUser = async payload => {
	console.log("in add user")
	const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "users/_search",
			{
				method: 'POST',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json'
			}
	}).then(response => {
		if (response.hits.total >= 1) {
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