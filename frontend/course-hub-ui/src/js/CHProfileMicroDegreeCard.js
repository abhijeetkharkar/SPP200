import {Button, Card, Col, Form, Jumbotron} from "react-bootstrap";
import React, {Component} from "react";
import {
    doDeleteProfilePicture,
    doDeleteUser,
    doGetProfilePicture,
    reauthenticateWithCredential
} from "../FirebaseUtils";
import {elasticDeleteUser} from "../elasticSearch";
import {CollapsibleComponent, CollapsibleContent, CollapsibleHead} from "./CHMicroDegreeForm";

class CHDeactivateCard extends Component {

    constructor(props, context) {
        super(props, context);
        this.state ={
            password: "",
            serverErrorMsg: "",
            elastic_message: "",
        }
    }

    render() {
        return(
            <div className="microDegreeCard">
                <Card className="microDegreeSuggestionsCard">
                    <Jumbotron className="jumboMicroDegreeTitle">Microdegree Registered</Jumbotron>
                    <CollapsibleComponent>
                        <Button className="updateCollapseButton">
                            <CollapsibleHead className="additionalClassForHead">Introductory&nbsp;&nbsp;</CollapsibleHead>
                        </Button>
                        <CollapsibleContent className="additionalClassForContent">
                            Hi
                            {/*<Jumbotron className="jumbo">*/}
                                {/*{*/}
                                    {/*item.introductory.length > 0 ?*/}
                                        {/*item.introductory.map((innerItem, index) => {*/}
                                            {/*return (*/}
                                                {/*<div className="internalMicroDegreeRecommendation">*/}
                                                    {/*<Jumbotron className="jumboCourse">*/}
                                                        {/*/!* <Card.Title className="titleBackground"><h6 className="degreeTitle"><a target="_blank" href={'/course?courseId=' + innerItem.CourseId }>{innerItem.Title}</a></h6></Card.Title> *!/*/}
                                                        {/*<div className="courseTitle"><a target="_blank"*/}
                                                                                        {/*href={'/course?courseId=' + innerItem.CourseId}> {innerItem.Title}</a>*/}
                                                        {/*</div>*/}
                                                        {/*<Card.Text className="microDegreeText">*/}
                                                            {/*<span*/}
                                                                {/*className="microDegreeProvider"><b>Provider : </b><Jumbotron*/}
                                                                {/*className="jumboCourseProvider">{innerItem.CourseProvider}</Jumbotron></span>*/}
                                                            {/*<span className="microDegreeDifficulty"><b>Difficulty : </b><Jumbotron*/}
                                                                {/*className="jumboDifficulty">{innerItem.Difficulty}</Jumbotron></span>*/}
                                                            {/*<span*/}
                                                                {/*className="microDegreeDuration"><b>Duration : </b><Jumbotron*/}
                                                                {/*className="jumboCourseDuration">{innerItem.CourseDuration.Value} {innerItem.CourseDuration.Unit}</Jumbotron></span>*/}
                                                        {/*</Card.Text>*/}
                                                    {/*</Jumbotron>*/}
                                                {/*</div>*/}
                                            {/*);*/}
                                        {/*}) :*/}
                                        {/*[]*/}
                                {/*}*/}
                            {/*</Jumbotron>*/}
                        </CollapsibleContent>
                    </CollapsibleComponent>
                    <CollapsibleComponent>
                        <Button className="updateCollapseButton"
                                onClick={this.updateCollapse(index, 'intermediate')}><CollapsibleHead
                            className="additionalClassForHead">Intermediate <i
                            className={this.state.coursesDisplay[index].arrow.intermediate}></i></CollapsibleHead>
                        </Button>
                        <CollapsibleContent className="additionalClassForContent"
                                            isExpanded={this.state.coursesDisplay[index]['intermediate']}>
                            <Jumbotron className="jumbo">
                                {
                                    item.intermediate.length > 0 ?
                                        item.intermediate.map((innerItem, index) => {
                                            return (
                                                <div className="internalMicroDegreeRecommendation">
                                                    <Jumbotron className="jumboCourse">
                                                        {/* <Card.Title className="titleBackground"><h6 className="degreeTitle"><a target="_blank" href={'/course?courseId=' + innerItem.CourseId }>{innerItem.Title}</a></h6></Card.Title> */}
                                                        <div className="courseTitle"><a target="_blank"
                                                                                        href={'/course?courseId=' + innerItem.CourseId}> {innerItem.Title}</a>
                                                        </div>
                                                        <Card.Text className="microDegreeText">
                                                            <span
                                                                className="microDegreeProvider"><b>Provider : </b><Jumbotron
                                                                className="jumboCourseProvider">{innerItem.CourseProvider}</Jumbotron></span>
                                                            <span className="microDegreeDifficulty"><b>Difficulty : </b><Jumbotron
                                                                className="jumboDifficulty">{innerItem.Difficulty}</Jumbotron></span>
                                                            <span
                                                                className="microDegreeDuration"><b>Duration : </b><Jumbotron
                                                                className="jumboCourseDuration">{innerItem.CourseDuration.Value} {innerItem.CourseDuration.Unit}</Jumbotron></span>
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
                        <Button className="updateCollapseButton"
                                onClick={this.updateCollapse(index, 'advanced')}><CollapsibleHead
                            className="additionalClassForHead">Advanced&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i
                            className={this.state.coursesDisplay[index].arrow.advanced}></i></CollapsibleHead> </Button>
                        <CollapsibleContent className="additionalClassForContent"
                                            isExpanded={this.state.coursesDisplay[index]['advanced']}>
                            <Jumbotron className="jumbo">
                                {
                                    item.advanced.length > 0 ?
                                        item.advanced.map((innerItem, index) => {
                                            return (
                                                <div className="internalMicroDegreeRecommendation">
                                                    <Jumbotron className="jumboCourse">
                                                        {/* <Card.Title className="titleBackground"><h6 className="degreeTitle"><a target="_blank" href={'/course?courseId=' + innerItem.CourseId }>{innerItem.Title}</a></h6></Card.Title> */}
                                                        <div className="courseTitle"><a target="_blank"
                                                                                        href={'/course?courseId=' + innerItem.CourseId}> {innerItem.Title}</a>
                                                        </div>
                                                        <Card.Text className="microDegreeText">
                                                            <span
                                                                className="microDegreeProvider"><b>Provider : </b><Jumbotron
                                                                className="jumboCourseProvider">{innerItem.CourseProvider}</Jumbotron></span>
                                                            <span className="microDegreeDifficulty"><b>Difficulty : </b><Jumbotron
                                                                className="jumboDifficulty">{innerItem.Difficulty}</Jumbotron></span>
                                                            <span
                                                                className="microDegreeDuration"><b>Duration : </b><Jumbotron
                                                                className="jumboCourseDuration">{innerItem.CourseDuration.Value} {innerItem.CourseDuration.Unit}</Jumbotron></span>
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

                    <br/>
                    <div id="registerButton">
                        <Button variant="primary" className="microDegreeRegister" onClick={this.saveMicroDegree(index)}>Register
                            For This MicroDegree</Button>
                        {this.state.coursesDisplay[index].saving == true &&
                        <div className="savedIcon">
                            <Button variant="warning">Saving...</Button>
                        </div>
                        }
                        {this.state.coursesDisplay[index].saved == true &&
                        <div className="savedIcon">
                            <Button variant="success">Saved</Button>
                        </div>
                        }
                    </div>
                </Card>
                <br/>
                <br/>
            </div>
        );
    }
}

export default CHDeactivateCard;

