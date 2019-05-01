import {Button, Card, Jumbotron} from "react-bootstrap";
import React, {Component} from "react";
import {CollapsibleComponent, CollapsibleHead, CollapsibleContent} from 'react-collapsible-component'
import {getUserMicroDegree, elasticDeleteUser} from "../elasticSearch";
import '../css/microdegree.css';
import '../css/profile.css';

class CHProfileMicroDegreeCard extends Component {

    constructor(props, context) {
        super(props, context);
        this.state ={
            email : this.props.email,
            degree : [],
            coursesDisplay : []
        };

        this.setUserMicrodegree(this.props.email);
    };

    setUserMicrodegree = async (email) => {
        var payload = {
            query: {
                bool: {
                    must : {
                        term : { "userID" : this.state.email }
                    }
                }
            }
        };
        console.log("EMAIL IS ", this.state.email)
        var courseDisplay = []
        var degree = []
        await getUserMicroDegree(payload).then(elasticResponse => {
            console.log("LENGTH IS ", elasticResponse['hits']['hits'].length, this.state.degree.length)
            console.log("RESPONSE IS ",elasticResponse['hits']['hits'])
            for (let i = 0; i < elasticResponse['hits']['hits'].length; i++) {
                courseDisplay.push({
                    introductory : false,
                    intermediate : false,
                    advanced : false,
                    arrow: {
                        introductory : 'rightarrow',
                        intermediate : 'rightarrow',
                        advanced : 'rightarrow'
                    } 
                })
            }

            for (let i = 0; i < elasticResponse['hits']['hits'].length; i++) {
                degree.push(elasticResponse['hits']['hits'][i]['_source'])
            }

            this.setState({
                degree: degree,
                coursesDisplay: courseDisplay
            }, () => {
                console.log("STATE IS ", this.state);
            });
        });
        console.log("Child degree", this.state.degree)
    }

    componentWillReceiveProps(nextProps){
        // var courseDisplay = []
        // if (nextProps.errorResponse){
        //     this.setState({
        //         errorResponse: nextProps.errorResponse,
        //         choice: nextProps.choice
        //     }, () => {
        //         console.log("This state is ", this.state);
        //     });
        // }else{
        //     console.log("Next props Recieved are : ", nextProps);
        //     console.log("LENGTH OF NEXT PROPS IS ", nextProps.microDegreeSuggestions.length);
        //     for (let i = 0; i < nextProps.microDegreeSuggestions.length; i++) {
        //         courseDisplay.push({
        //             introductory : false,
        //             intermediate : false,
        //             advanced : false,
        //             arrow: {
        //                 introductory : 'rightarrow',
        //                 intermediate : 'rightarrow',
        //                 advanced : 'rightarrow'
        //             },
        //             saved: false,
        //             saving : false,
        //         })
        //     }
        //
        //     this.setState({
        //         errorResponse: null,
        //         choice: nextProps.choice,
        //         degree : nextProps.microDegreeSuggestions,
        //         coursesDisplay :  courseDisplay,
        //         email: nextProps.email
        //     }, () => {
        //         console.log("THIS IS STATE : ", this.state);
        //     });
        // }
    }

    updateCollapse = (index, courseType) => (e) => {
        e.preventDefault();
        console.log("Update collapse function called ", index, courseType);
        var currentCourseDisplay = this.state.coursesDisplay;

        currentCourseDisplay[index][courseType] = !currentCourseDisplay[index][courseType]
        if (currentCourseDisplay[index]['arrow'][courseType] == 'rightarrow'){
            currentCourseDisplay[index]['arrow'][courseType] = 'downarrow';
        }
        else{
            currentCourseDisplay[index]['arrow'][courseType] = 'rightarrow';
        }
        this.setState({
            coursesDisplay : currentCourseDisplay
        }, () => {
            console.log("STATE AFTER UPDATE COLLAPSE IS ", this.state);
        });
    }

    render() {
        return(
            <div className="microdegree-content">
                {
                    this.state.degree.length > 0 ?
                        this.state.degree.map((item, index) => {
                            return (
                                <div className="microDegreeCard">
                                    <Card className="microDegreeSuggestionsCard">
                                        <Jumbotron className="jumboMicroDegreeTitle">Microdegree Suggestion {index+1}</Jumbotron>
                                            <CollapsibleComponent>
                                                <Button className="updateCollapseButton" onClick={this.updateCollapse(index, 'introductory')}><CollapsibleHead className="additionalClassForHead">Introductory&nbsp;&nbsp;<i class={this.state.coursesDisplay[index].arrow.introductory}></i></CollapsibleHead>  </Button>
                                                <CollapsibleContent className="additionalClassForContent" isExpanded={this.state.coursesDisplay[index]['introductory']}>
                                                    <Jumbotron className="jumbo">
                                                        {
                                                            item.introductory.length > 0 ?
                                                                item.introductory.map((innerItem, index) => {
                                                                    return (
                                                                        <div className="internalMicroDegreeRecommendation">
                                                                            <Jumbotron className="jumboCourse">
                                                                                {/* <Card.Title className="titleBackground"><h6 className="degreeTitle"><a target="_blank" href={'/course?courseId=' + innerItem.CourseId }>{innerItem.Title}</a></h6></Card.Title> */}
                                                                                <div className="courseTitle"><a target="_blank" href={'/course?courseId=' + innerItem.CourseId }> {innerItem.Title}</a> </div>
                                                                                <Card.Text className="microDegreeText">
                                                                                    <span className="microDegreeProvider"><b>Provider : </b><Jumbotron className="jumboCourseProvider">{innerItem.CourseProvider}</Jumbotron></span>
                                                                                    <span className="microDegreeDifficulty"><b>Difficulty : </b><Jumbotron className="jumboDifficulty">{innerItem.Difficulty}</Jumbotron></span>
                                                                                    <span className="microDegreeDuration"><b>Duration : </b><Jumbotron className="jumboCourseDuration">{innerItem.CourseDuration.Value} {innerItem.CourseDuration.Unit}</Jumbotron></span>
                                                                                </Card.Text>
                                                                            </Jumbotron>    
                                                                        </div>
                                                                    );
                                                                }) :
                                                                []
                                                        }
                                                    </Jumbotron>
                                                </CollapsibleContent>
                                            </CollapsibleComponent>
                                            <CollapsibleComponent>
                                                <Button className="updateCollapseButton" onClick={this.updateCollapse(index, 'intermediate')}><CollapsibleHead className="additionalClassForHead">Intermediate <i class={this.state.coursesDisplay[index].arrow.intermediate}></i></CollapsibleHead>  </Button>
                                                <CollapsibleContent className="additionalClassForContent" isExpanded={this.state.coursesDisplay[index]['intermediate']}>
                                                    <Jumbotron className="jumbo">
                                                        {
                                                            item.intermediate.length > 0 ?
                                                                item.intermediate.map((innerItem, index) => {
                                                                    return (
                                                                        <div className="internalMicroDegreeRecommendation">
                                                                            <Jumbotron className="jumboCourse">
                                                                                {/* <Card.Title className="titleBackground"><h6 className="degreeTitle"><a target="_blank" href={'/course?courseId=' + innerItem.CourseId }>{innerItem.Title}</a></h6></Card.Title> */}
                                                                                <div className="courseTitle"><a target="_blank" href={'/course?courseId=' + innerItem.CourseId }> {innerItem.Title}</a> </div>
                                                                                <Card.Text className="microDegreeText">
                                                                                    <span className="microDegreeProvider"><b>Provider : </b><Jumbotron className="jumboCourseProvider">{innerItem.CourseProvider}</Jumbotron></span>
                                                                                    <span className="microDegreeDifficulty"><b>Difficulty : </b><Jumbotron className="jumboDifficulty">{innerItem.Difficulty}</Jumbotron></span>
                                                                                    <span className="microDegreeDuration"><b>Duration : </b><Jumbotron className="jumboCourseDuration">{innerItem.CourseDuration.Value} {innerItem.CourseDuration.Unit}</Jumbotron></span>
                                                                                </Card.Text>
                                                                            </Jumbotron>    
                                                                        </div>
                                                                    );
                                                                }) :
                                                                []
                                                        }
                                                    </Jumbotron>
                                                </CollapsibleContent>
                                            </CollapsibleComponent>
                                            <CollapsibleComponent>
                                                <Button className="updateCollapseButton" onClick={this.updateCollapse(index, 'advanced')}><CollapsibleHead className="additionalClassForHead">Advanced&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class={this.state.coursesDisplay[index].arrow.advanced}></i></CollapsibleHead>  </Button>
                                                <CollapsibleContent className="additionalClassForContent" isExpanded={this.state.coursesDisplay[index]['advanced']}>
                                                    <Jumbotron className="jumbo">
                                                        {
                                                            item.advanced.length > 0 ?
                                                                item.advanced.map((innerItem, index) => {
                                                                    return (
                                                                        <div className="internalMicroDegreeRecommendation">
                                                                            <Jumbotron className="jumboCourse">
                                                                                {/* <Card.Title className="titleBackground"><h6 className="degreeTitle"><a target="_blank" href={'/course?courseId=' + innerItem.CourseId }>{innerItem.Title}</a></h6></Card.Title> */}
                                                                                <div className="courseTitle"><a target="_blank" href={'/course?courseId=' + innerItem.CourseId }> {innerItem.Title}</a> </div>
                                                                                <Card.Text className="microDegreeText">
                                                                                    <span className="microDegreeProvider"><b>Provider : </b><Jumbotron className="jumboCourseProvider">{innerItem.CourseProvider}</Jumbotron></span>
                                                                                    <span className="microDegreeDifficulty"><b>Difficulty : </b><Jumbotron className="jumboDifficulty">{innerItem.Difficulty}</Jumbotron></span>
                                                                                    <span className="microDegreeDuration"><b>Duration : </b><Jumbotron className="jumboCourseDuration">{innerItem.CourseDuration.Value} {innerItem.CourseDuration.Unit}</Jumbotron></span>
                                                                                </Card.Text>
                                                                            </Jumbotron>    
                                                                        </div>
                                                                    );
                                                                }) :
                                                                []
                                                        }
                                                    </Jumbotron>
                                                </CollapsibleContent>
                                            </CollapsibleComponent>
                        
                                            {/* <br />
                                            <div id="registerButton">
                                                <Button variant="primary" className="microDegreeRegister" id={'registerMicroDegree' + index} onClick={this.saveMicroDegree(index)}>Register For This MicroDegree</Button>
                                                {this.state.coursesDisplay[index].saving == true &&
                                                    <div className="savedIcon">
                                                        <Button variant="warning">Saving...</Button>
                                                    </div>
                                                }
                                                {this.state.coursesDisplay[index].saved == true &&
                                                    <div className="savedIcon">
                                                        <Button variant="success" id={'degreeSaved' + index}>Saved</Button>
                                                    </div>
                                                }
                                            </div> */}
                                        </Card>
                                        <br />
                                        <br />
                                </div>
                            );
                        }) :
                        []
                }
            </div>
        );
    }
}

export default CHProfileMicroDegreeCard;

