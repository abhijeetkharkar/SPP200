const fetch = require("node-fetch");

const addUser = async payload => {
    // console.log("in add user")
    const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "users/user",
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
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
            headers: {
                'Content-Type': 'application/json'
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
    const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "users/_search",
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(elasticData => {
            if (elasticData.hits.total >= 1) {
                // console.log("Get User Details JSON OBJECT IS ")
                // console.log("log is ", elasticData.hits.hits[0]._source);
                return { 'id': elasticData.hits.hits[0]._id, 'data': elasticData.hits.hits[0]._source };
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
    return await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "users/user/" + _id + '/_update',
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(elasticData => {
            // console.log("Update User JSON OBJECT IS ")
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
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
        return response.json();
    }).then(elasticData => {
        if (elasticData.deleted >= 1) {
            return true;
        } else {
            return false;
        }
    }).catch(error => {
        console.log(error);
        return false;
    });
};

const addDeal = async (payload) => {
    // console.log("ADD DEAL IN ELASTIC SEARCH API");
    const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_ADD_DEAL_URL,
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(elasticData => {
            if (elasticData['result'].trim() === 'created') {
                return elasticData["_id"];
            } else {
                return false;
            }
        }).catch(error => {
            // console.log("Error in Adding Deals to Elastic Search database");
            // console.log("Error : ",error);
            return false;
        });
    return response;
};

const addReview = async (payload) => {
    // console.log("ADD Review IN ELASTIC SEARCH API");
    const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "reviews/review",
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(elasticData => {
            if (elasticData['result'].trim() === 'created') {
                return true;
            } else {
                return false;
            }
        }).catch(error => {
            // console.log("Error in Adding Review to Elastic Search database", error);
            return false;
        });
    return response;
};

const getReviews = async payload => {
    // console.log("in search user");
    const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "reviews/_search",
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(elasticData => {
            if (elasticData.hits.total >= 1) {
                // console.log("Get User Details JSON OBJECT IS ")
                // console.log("log is ", elasticData.hits.hits[0]._source);
                var reviews = elasticData.hits.hits.map(review => {
                    var reviewInfo = review._source;
                    reviewInfo["id"] = review._id;
                    return reviewInfo;
                });
                return reviews;
            } else {
                return null;
            }
        }).catch(error => {
            return null;
        });
    // console.log("Search User Response:", response);
    return response;
}

const updateReview = async (_id, payload) => {
    // console.log("in update user");
    // console.log("payload is:", payload);
    return await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "reviews/review/" + _id + '/_update',
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
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

const addUserReviewLike = async (payload) => {
    // console.log("ADD Review IN ELASTIC SEARCH API");
    const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "userreviewlikes/userreviewlike",
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(elasticData => {
            if (elasticData['result'].trim() === 'created') {
                return true;
            } else {
                return false;
            }
        }).catch(error => {
            // console.log("Error in Adding Review to Elastic Search database", error);
            return false;
        });
    return response;
};

const getUserReviewLikes = async payload => {
    // console.log("in search user");
    const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "userreviewlikes/_search",
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(elasticData => {
            // console.log("Elastic Data: ", elasticData);
            if (elasticData.hits.total >= 1) {
                var reviews = elasticData.hits.hits.map(review => {
                    var reviewInfo = review._source;
                    reviewInfo["id"] = review._id;
                    return reviewInfo;
                });
                return reviews;
            } else {
                return null;
            }
        }).catch(error => {
            // console.log("Error in Adding Review to Elastic Search database", error);
            return null;
        });
    // console.log("Search User Response:", response);
    return response;
}

const updateUserReviewLike = async (_id, payload) => {
    // console.log("in update user");
    // console.log("payload is:", payload);
    return await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "userreviewlikes/userreviewlike/" + _id + '/_update',
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
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

const getCourseDetails = async payload => {
    // console.log("in search user");
    const response = await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "courses/_search",
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(elasticData => {
            if (elasticData.hits.total >= 1) {
                var courseDetails = elasticData.hits.hits[0]._source;
                courseDetails["id"] = elasticData.hits.hits[0]._id;
                console.log("In elasticSearch, getCourseDetails, Details: ", courseDetails);
                return courseDetails;
            } else {
                return null;
            }
        }).catch(error => {
            console.log("In elasticSearch, getCourseDetails, error: ", error);
            return null;
        });
    // console.log("Search User Response:", response);
    return response;
}

const updateCourseRating = async (_id, payload) => {
    // console.log("in update user");
    // console.log("payload is:", payload);
    return await fetch(process.env.REACT_APP_AWS_ELASTIC_SEARCH_URL + "courses/course/" + _id + '/_update',
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
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

const getDealsfromES = async (payload) => {
    return await fetch(process.env.REACT_APP_GET_DEALS, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        return response.json();
    });
}

const getSpecificDealFromES = async (payload) => {
    return await fetch(process.env.REACT_APP_SEARCH_DEALS, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        return response.json();
    });
}

const getDealVotesFromES = async (payload) => {
    return await fetch(process.env.REACT_APP_SEARCH_DEAL_VOTE, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        return response.json();
    });
}

const updateDealVotesinES = async (voteID, payload) => {
    var url = process.env.REACT_APP_UPDATE_DEAL_VOTE + voteID + '/_update';
    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        return response.json();
    });
}

const updateDealsinES = async (url, payload) =>{
    // var url = process.env.REACT_APP_UPDATE_DEALS + this.state.showCompleteDealID + '/_update';
    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        return response.json();
    });
}

const addDealVoteinES = async (payload) => {
    return await fetch(process.env.REACT_APP_ADD_DEAL_VOTE, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        return response.json();
    });
}

const getMicroDegreeSuggestions = async (payload) => {
    return await fetch(process.env.REACT_APP_GET_MICRODEGREE, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        return response.json();
    });
}

const saveMicroDegree = async (payload) => {
    return await fetch(process.env.REACT_APP_SAVE_MICRODEGREE, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        return response.json();
    });
}

const getUserMicroDegree = async (payload) => {
    return await fetch(process.env.REACT_APP_GET_USER_MICRODEGREE, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        return response.json();
    });

}

export {addUser, searchUser, getUserDetails, updateUser, elasticDeleteUser, addDeal, 
    addReview, getReviews, updateReview, getCourseDetails, updateCourseRating, 
    getDealsfromES, getSpecificDealFromES, getDealVotesFromES, updateDealVotesinES, 
    updateDealsinES, addDealVoteinES, addUserReviewLike, getUserReviewLikes, updateUserReviewLike,
    getMicroDegreeSuggestions, saveMicroDegree, getUserMicroDegree };