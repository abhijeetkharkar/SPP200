import React, { Component } from 'react';
import queryString from 'query-string';
import '../App.css';
import '../css/common-components.css';
import '../css/card.css';
import '../css/microdegree.css';
import '../css/course-details.css';
import Chip from '@material-ui/core/Chip';
import { Modal, Button, Form, Col, Badge, Card, Jumbotron, Image, Row, Container } from 'react-bootstrap';
import CHAdvertisements from './CHAdvertisements';
import Spinner from 'react-spinner-material';
// import Collapsible from 'react-collapsible';
import {CollapsibleComponent, CollapsibleHead, CollapsibleContent} from 'react-collapsible-component'
import CHFooter from './CHFooter';

class CHMicroDegreeForm extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
            currentWord: "",
            currentTimeInterval: 0,
            choice : this.props.choice,
            chips : [],
            errorResponse : null,
            degree : this.props.microDegreeSuggestions,
            coursesDisplay : []
        };
        this.updateTag = this.updateTag.bind(this);
        this.updateCollapse = this.updateCollapse.bind(this);
	}

    // Dont need this for now 
	componentWillMount() {
		console.log("Component will mount called ");
    }

    componentWillReceiveProps(nextProps){
        var courseDisplay = []
        if (nextProps.errorResponse){
            this.setState({
                errorResponse: nextProps.errorResponse,
                choice: nextProps.choice
            }, () => {
                console.log("This state is ", this.state);
            });
        }else{
            console.log("Next props Recieved are : ", nextProps);
            console.log("LENGTH OF NEXT PROPS IS ", nextProps.microDegreeSuggestions.length);
            for (let i = 0; i < nextProps.microDegreeSuggestions.length; i++) {
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
    
            this.setState({
                errorResponse: null,
                choice: nextProps.choice,
                degree : nextProps.microDegreeSuggestions,
                coursesDisplay :  courseDisplay
            }, () => {
                console.log("THIS IS STATE : ", this.state);
            })
        }
    }

    updateTag = (e) => {
        this.setState({
            currentWord: e.target.value
        })
    }

    updateTimeInterval = (e) => {
        this.setState({
            currentTimeInterval : e.target.value
        })
    }
    
    tagChanged = (e) => {
        if (e.key == 'Enter'){
            this.setState({
                currentWord: e.target.value
            }, () =>{
                var joinedChips = this.state.chips.concat(this.state.currentWord);
                this.setState({ chips: joinedChips, currentWord: "" }, () => {
                    console.log("Updated Chips are  ", this.state);
                })
            });
        }else{
            this.setState({
                currentWord: e.target.value
            });
        }
    }

    formSubmitted = (e) => {
        e.preventDefault();
        console.log("Submit Key Pressed");
    }

    loadSuggestions = (e) => {
        e.preventDefault();
        // Updating to Waiting State
        this.setState({
            choice: 'waitingForSuggestions',
            errorResponse: null
        });
        var params = {
            chips : this.state.chips,
            durations : this.state.currentTimeInterval
        };
        this.props.onFormSubmit(params);
        console.log("Button Pressed");
        console.log("Tags are : ", this.state.chips);
        console.log("Time Duration is : ", this.state.currentTimeInterval);
    }

    removeChip = index => () => {
        console.log("Remove Chip function called index : ", index);
        // const chipToDelete = this.state.chips.indexOf(data);
        var updatedChips = this.state.chips;
        updatedChips.splice(index, 1);
        this.setState({chips: updatedChips});
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
        var choice = this.state.choice;
        var floatLeft = {
            'float' : 'left'
        }
        var hiddenClass = {
            'visibility': 'hidden'
        };
		return (
			<div className="my-content-landing">
                <div className="microDegreeForm">
                    <Form className="microDegreeFormInput" onSubmit={this.formSubmitted}>
                        <br />
                        <Form.Label style={floatLeft}><h4>Degree Tags</h4></Form.Label>
                        <Form.Control type="text" value={this.state.currentWord} placeholder="Press Enter after typing tags!!!" onChange={this.updateTag} onKeyDown={this.tagChanged}/>
                        {   this.state.chips.length > 0 ?
                                this.state.chips.map((item, index) => {
                                    return (
                                        <Chip key={"key"+index} label={item} className="chipClass" color="primary" onDelete={this.removeChip(index)}/>
                                    )
                                }) :
                                []
                        }
                        <br />
                        <br />
                        <Form.Label style={floatLeft}><h4>Degree Time Interval</h4></Form.Label>
                        <Form.Control type="number" value={this.state.currentTimeInterval} placeholder="Enter Degree Time Interval in Hours" onChange={this.updateTimeInterval} minlength='5' maxlength='50'/>
                        <br />
                        <Button variant="primary" type="button" onClick={this.loadSuggestions} style={floatLeft}>
                            Get MicroDegree Suggestions
                        </Button>
                        <br /><br /><br />
                    </Form>
                    
                    {choice === 'waitingForSuggestions' &&
                        <div className="microDegreeSuggestionsLoading">
                            <Spinner size={40} spinnerColor="#333333" spinnerWidth={5} visible={true} />
                        </div>
                    }

                    { this.state.errorResponse != null &&
                        <div className="microDegreeSuggestionsLoading">
                            <div className="floatLeft">
                                {this.state.errorResponse}
                            </div>
                        </div>
                    }

                    {choice === 'degreeSuggestions' &&
                        <div className="microDegreeSuggestions">
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
                                        
                                                            <br />
                                                            <Button variant="primary" className="microDegreeRegister">Register For This MicroDegree</Button> 
                                                        </Card>
                                                        <br />
                                                        <br />
                                                </div>
                                            );
                                        }) :
                                        []
                                },
                        </div>
                    }
                </div>
			</div>
		);
	}
}

export default CHMicroDegreeForm;