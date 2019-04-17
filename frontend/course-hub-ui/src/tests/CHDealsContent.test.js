import React from 'react';
import CHDealsContent from '../js/CHDealsContent';
import { shallow } from 'enzyme';
import firebaseInitialization from '../FirebaseUtils';
import { inspect, error } from 'util';
const elastic = require('../elasticSearch');
jest.mock('../elasticSearch');

const onAuthStateChanged = jest.fn(() => {
    return Promise.resolve({
        displayName: 'testDisplayName',
        email: 'test@test.com',
        emailVerified: true
    })
});

jest.spyOn(firebaseInitialization, 'auth').mockImplementation(() => {
    return {
        onAuthStateChanged,
        currentUser: {
            displayName: 'testDisplayName',
            email: 'test@test.com',
            emailVerified: true
        }
    }
})

// Testing Loading of Deals Page 
test('Loading DegreeContent ', async () => {
    elastic.getDealsfromES.mockImplementation(() => {
        return Promise.resolve({
            "deals" : [],
            "number_of_pages" : 0,
            "current_page" : 0, 
            "total_deals" : 10
        })
    });
    const wrapper = await shallow(<CHDealsContent pageType="deals" pageNumber="0" />);
    expect(wrapper.exists()).toBe(true);
});

test('Loading DegreeContent - Error ', async () => {
    elastic.getDealsfromES.mockImplementation(() => {
        throw error
    });
    try{
        await shallow(<CHDealsContent pageType="deals" pageNumber="0" />);
    }catch(e){
        expect(e).toMatch('error');
    }
});

describe("Deals Loading Content Testing ", () => {
    beforeEach(() => {
        elastic.getSpecificDealFromES.mockImplementation(() => {
            return Promise.resolve({
                "hits" : {
                    "hits" : [
                        {
                            "_source" : "dummyValue"
                        }
                    ]
                }
            });
        });
    });

    test('Instance state should be no deal if deals array is empty', async () => {
        elastic.getDealsfromES.mockImplementation(() => {
            return Promise.resolve({
                "deals" : [],
                "number_of_pages" : 0,
                "current_page" : 0, 
                "total_deals" : 10
            })
        });

        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();

        var props = {
            pageType: "deals",
            pageNumber: "0",
            dealCategory: "all"
        }
        try{
            await instance.componentWillReceiveProps(props);
            expect(instance.state.currentLayout).toBe('nodeal');
        }catch(e){
            expect(e).toMatch('error');
        }
    });

    test('Instance state should be no deal if deals array is not empty', async () => { 
        elastic.getDealsfromES.mockImplementation(() => {
            return Promise.resolve({
                "deals" : [{}, {}],
                "number_of_pages" : 0,
                "current_page" : 0, 
                "total_deals" : 10
            })
        });
        
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();

        var props = {
            pageType: "deals",
            pageNumber: "0",
            dealCategory: "all"
        }
        try{
            await instance.componentWillReceiveProps(props);
            expect(instance.state.currentLayout).toBe('deals');
        }catch(e){
            expect(e).toMatch('error');
        }
    });

    test('Add new deal should be the state type when passed as pageType Props', async () => {
        elastic.getDealsfromES.mockImplementation(() => {
            return Promise.resolve({
                "deals" : [{}, {}],
                "number_of_pages" : 0,
                "current_page" : 0, 
                "total_deals" : 10
            })
        });

        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        
        var props = {
            pageType: "addnewdeal",
            pageNumber: "0",
            dealCategory: "all"
        }
        try{
            await instance.componentWillReceiveProps(props);
            expect(instance.state.currentLayout).toBe('deals');
        }catch(e){
            expect(e).toMatch('error');
        }
    });

    test('Error handling when error is thrown by get deals API', async () => {
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        elastic.getDealsfromES.mockImplementation(() => {
            throw error;
        });

        var props = {
            pageType: "deals",
            pageNumber: "0",
            dealCategory: "all"
        }
        try{
            await instance.componentWillReceiveProps(props);
        }catch(e){
            expect(e).toMatch('error');
        }
    });


    test('Loading Course Modal ', async () => {
        elastic.getDealVotesFromES.mockImplementation(() => {
            return Promise.resolve({
                "hits" : {
                    "total" : 10,
                    "hits" : [
                        {
                            "_source" : {
                                "vote" : 1
                            }
                        }
                    ]
                }
            });
        });
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        try{
            await instance.showDealModal("someDummyCourseID");
            expect(instance.state.upVoteVariant).toBe('light');
            expect(instance.state.downVoteVariant).toBe('light');
        }catch(e){
            expect(e).toMatch('error');
        }
    });

    test('Loading Course Modal - different parameters', async () => {
        elastic.getDealVotesFromES.mockImplementation(() => {
            return Promise.resolve({
                "hits" : {
                    "total" : 1,
                    "hits" : [
                        {
                            "_source" : {
                                "vote" : 1
                            }
                        }, {}
                    ]
                }
            });
        });
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        try{
            await instance.showDealModal("someDummyCourseID");
            expect(instance.state.upVoteVariant).toBe('light');
            expect(instance.state.downVoteVariant).toBe('light');
        }catch(e){
            expect(e).toMatch('error');
        }
    });

    test('Loading Course Modal - different parameters - 2', async () => {
        elastic.getDealVotesFromES.mockImplementation(() => {
            return Promise.resolve({
                "hits" : {
                    "total" : 1,
                    "hits" : [
                        {
                            "_source" : {
                                "vote" : 2
                            }
                        }
                    ]
                }
            });
        });
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        try{
            await instance.showDealModal("someDummyCourseID");
            expect(instance.state.upVoteVariant).toBe('light');
            expect(instance.state.downVoteVariant).toBe('light');
        }catch(e){
            expect(e).toMatch('error');
        }
    });

    test('Loading Course Modal - different parameters - 2', async () => {
        jest.spyOn(firebaseInitialization, 'auth').mockImplementationOnce(() => {
            return {
                currentUser: null
            }
        })
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        try{
            await instance.showDealModal("someDummyCourseID");
            expect(instance.state.upVoteVariant).toBe('light');
            expect(instance.state.downVoteVariant).toBe('light');
        }catch(e){
            expect(e).toMatch('error');
        }
    });

    test('Loading Course Modal - different parameters - 2', async () => {
        elastic.getSpecificDealFromES.mockImplementation(() => {
            throw error
        });
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        try{
            await instance.showDealModal("someDummyCourseID");
        }catch(e){
            expect(e).toMatch('error');
        }
    });
});


describe("Deals Up Vote Testing", () => {
    beforeEach(() => {
        elastic.getDealVotesFromES.mockImplementation(() => {
            return Promise.resolve({
                "hits" : {
                    "total" : 1,
                    "hits" : [
                        {
                            "_source" : {
                                "vote" : 1
                            }
                        }
                    ]
                }
            })
        });

        elastic.updateDealVotesinES.mockImplementation(() => {
            return Promise.resolve({
                "_shards" : {
                    "successful" : 1
                }
            });
        });

        elastic.updateDealsinES.mockImplementation(() => {
            return Promise.resolve({
                "_shards" : {
                    "successful" : 1
                }
            });
        })

        elastic.addDealVoteinES.mockImplementation(()  => {
            return Promise.resolve({
                "_shards" : {
                    "successful" : 1
                }
            });
        })
    });

    test('hide complete deal ', () => {
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        
        instance.hideCompleteDeal()
        expect(instance.state.subChoice).toBe("");
    })

    test('upvote scenario - 1', async () => {
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();

        try{
            await instance.upVote()
            expect(instance.state.upVoteVariant).toBe('warning')
        }catch(e){
            expect(e).toMatch('error');
        }
    })

    test('upvote scenario - 2', async () => {
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        elastic.getDealVotesFromES.mockImplementationOnce(() => {
            return Promise.resolve({
                "hits" : {
                    "total" : 1,
                    "hits" : [
                        {
                            "_source" : {
                                "vote" : 2
                            }
                        }
                    ]
                }
            })
        });
        instance.setState({
            'completeDealData' : {
                'data' : {
                    'thumbsDown' : 5,
                    'thumbsUp' : 5
                }
            }
        });

        try{
            await instance.upVote()
            expect(instance.state.upVoteVariant).toBe('light')
        }catch(e){
            expect(e).toMatch('error');
        }
    })

    test('upvote scenario - 2', async () => {
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        elastic.getDealVotesFromES.mockImplementationOnce(() => {
            return Promise.resolve({
                "hits" : {
                    "total" : 2,
                    "hits" : [
                        {
                            "_source" : {
                                "vote" : 2
                            }
                        }
                    ]
                }
            })
        });
        instance.setState({
            'completeDealData' : {
                'data' : {
                    'thumbsDown' : 5,
                    'thumbsUp' : 5
                }
            }
        });

        try{
            await instance.upVote()
            expect(instance.state.upVoteVariant).toBe('light')
        }catch(e){
            expect(e).toMatch('error');
        }
    })

    test('Should not allow to vote if not logged in ', async () => {
        jest.spyOn(firebaseInitialization, 'auth').mockImplementationOnce(() => {
            return {
                currentUser: null
            }
        })
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        try{
            await instance.upVote()
        }catch(e){
            expect(e).toMatch('error');
        }
    });
});

describe("Deals Down Vote Testing", () => {
    beforeEach(() => {
        elastic.getDealVotesFromES.mockImplementation(() => {
            return Promise.resolve({
                "hits" : {
                    "total" : 1,
                    "hits" : [
                        {
                            "_source" : {
                                "vote" : 1
                            }
                        }
                    ]
                }
            })
        });

        elastic.updateDealVotesinES.mockImplementation(() => {
            return Promise.resolve({
                "_shards" : {
                    "successful" : 1
                }
            });
        });

        elastic.updateDealsinES.mockImplementation(() => {
            return Promise.resolve({
                "_shards" : {
                    "successful" : 1
                }
            });
        })

        elastic.addDealVoteinES.mockImplementation(()  => {
            return Promise.resolve({
                "_shards" : {
                    "successful" : 1
                }
            });
        })
    });

    test('downvote scenario - 1', async () => {
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        instance.setState({
            'completeDealData' : {
                'data' : {
                    'thumbsDown' : 5,
                    'thumbsUp' : 5
                }
            }
        });

        try{
            await instance.downVote()
            expect(instance.state.downVoteVariant).toBe('light')
        }catch(e){
            expect(e).toMatch('error');
        }
    })

    test('upvote scenario - 2', async () => {
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        elastic.getDealVotesFromES.mockImplementationOnce(() => {
            return Promise.resolve({
                "hits" : {
                    "total" : 1,
                    "hits" : [
                        {
                            "_source" : {
                                "vote" : "-1"
                            }
                        }
                    ]
                }
            })
        });
        instance.setState({
            'completeDealData' : {
                'data' : {
                    'thumbsDown' : 5,
                    'thumbsUp' : 5
                }
            }
        });

        try{
            await instance.upVote();
            expect(instance.state.upVoteVariant).toBe('light')
        }catch(e){
            expect(e).toMatch('error');
        }
    })

    test('upvote scenario - 2', async () => {
        const wrapper = shallow(<CHDealsContent />);
        const instance = wrapper.instance();
        elastic.getDealVotesFromES.mockImplementationOnce(() => {
            return Promise.resolve({
                "hits" : {
                    "total" : 2,
                    "hits" : [
                        {
                            "_source" : {
                                "vote" : 2
                            }
                        }
                    ]
                }
            })
        });
        instance.setState({
            'completeDealData' : {
                'data' : {
                    'thumbsDown' : 5,
                    'thumbsUp' : 5
                }
            }
        });

        try{
            await instance.downVote()
            expect(instance.state.downVoteVariant).toBe('light')
        }catch(e){
            expect(e).toMatch('error');
        }
    })

    // test('Should not allow to vote if not logged in ', async () => {
    //     jest.spyOn(firebaseInitialization, 'auth').mockImplementationOnce(() => {
    //         return {
    //             currentUser: null
    //         }
    //     })
    //     const wrapper = shallow(<CHDealsContent />);
    //     const instance = wrapper.instance();
    //     try{
    //         await instance.upVote()
    //     }catch(e){
    //         expect(e).toMatch('error');
    //     }
    // });
});