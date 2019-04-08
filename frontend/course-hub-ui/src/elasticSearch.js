const fetch = require("node-fetch");

const addUser = async payload => {
	// console.log("in add user")
	const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "users/user",
			{ 
				method: 'POST',
				body: JSON.stringify(payload),
				headers: { 'Content-Type': 'application/json'}
            }).then(response => {
                return response.json();
            }).then(elasticData => {
                // console.log("JSON OBJECT IS ")
                // console.log("log is ", elasticData)
                if (elasticData.result === "created") {
                    return true;
                } else {
                    return false;
                }
            }).catch(error => {
                // console.log("Error in elastic search api is ", error)
                return false;
            });
	return response;
}

const searchUser = async payload => {
	// console.log("in search user");
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
	// console.log("Search User Response:", response);
	return response;
}

const getUserDetails = async payload => {
    // console.log("in search user");
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
            // console.log("Get User Details JSON OBJECT IS ")
            // console.log("log is ", elasticData.hits.hits[0]._source);
            return {'id': elasticData.hits.hits[0]._id, 'data': elasticData.hits.hits[0]._source};
        } else {
            return null;
        }
    }).catch(error => {
        return null;
    });
    // console.log("Search User Response:", response);
    return response;
}

const updateUser = async (_id, payload) => {
    // console.log("in update user");
    // console.log("payload is:", payload);
    return await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "users/user/" + _id + '/_update',
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
        return response.json();
    }).then(elasticData => {
        // console.log("Update User JSON OBJECT IS ")
        // console.log("log is ", elasticData)
        if (elasticData.result === "updated" || elasticData.result === "noop") {
            return true;
        } else {
            return false;
        }
    }).catch(error => {
        // console.log("Error in elastic search api is ", error)
        return false;
    });
}

const elasticDeleteUser = async payload => {
    return await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "users/_delete_by_query",
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
        return response.json();
    }).then(elasticData => {
        if (elasticData.deleted >= 1) {
            return true;
        } else {
            return false;
        }
    }).catch(error => {
        return false;
    });
};

const addDeal = async(payload) => {
    console.log("ADD DEAL IN ELASTIC SEARCH API");
    const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_ADD_DEAL_URL,
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json'}
        }).then(response => {
            return response.json();
        }).then(elasticData => {
            if (elasticData['result'].trim() === 'created'){
                return true;
            }else{
                return false;
            }
        }).catch(error => {
            console.log("Error in Adding Deals to Elastic Search database");
            console.log("Error : ",error);
            return false;
        });
    return response;
};

const updateReview = async (_id, payload) => {
    // console.log("in update user");
    // console.log("payload is:", payload);
    return await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "reviews/review/" + _id + '/_update',
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
        return response.json();
    }).then(elasticData => {
        // console.log("Update User JSON OBJECT IS ")
        // console.log("log is ", elasticData)
        if (elasticData.result === "updated" || elasticData.result === "noop") {
            return true;
        } else {
            return false;
        }
    }).catch(error => {
        // console.log("Error in elastic search api is ", error)
        return false;
    });
}

const updateCourse = async (_id, payload) => {
    // console.log("in update user");
    // console.log("payload is:", payload);
    return await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "courses/course/" + _id + '/_update',
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
        return response.json();
    }).then(elasticData => {
        // console.log("Update User JSON OBJECT IS ")
        // console.log("log is ", elasticData)
        if (elasticData.result === "updated" || elasticData.result === "noop") {
            return true;
        } else {
            return false;
        }
    }).catch(() => {
        // console.log("Error in elastic search api is ", error)
        return false;
    });
}

export {addUser, searchUser, getUserDetails, updateUser, addDeal, elasticDeleteUser, updateReview, updateCourse};