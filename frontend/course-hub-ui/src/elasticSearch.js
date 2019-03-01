const fetch = require("node-fetch");

const addUser = async payload => {
	console.log("in add user")
	const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "users/user", 
			{ 
				method: 'POST',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json'}
            }).then(response => {
                return response.json();
            }).then(elasticData => {
                console.log("JSON OBJECT IS ")
                console.log("log is ", elasticData)
                if (elasticData.result === "created") {
                    return true;
                } else {
                    return false;
                }
            }).catch(error => {
                console.log("Error in elastic search api is ", error)
                return false;
            });
	return response;
}

const searchUser = async payload => {
	console.log("in search user");
	const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "users/_search",
			{
				method: 'POST',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json'
			}
            }).then(response => {
                return response.json();
            }).then(elasticData => {
                if (elasticData.hits.total >= 1) {
                    return elasticData.hits.hits[0]._source.UserName.First;
                } else {
                    return null;
                }
            }).catch(error => {
                return null;
			});
	console.log("Search User Response:", response);
	return response;
}

export {addUser, searchUser};