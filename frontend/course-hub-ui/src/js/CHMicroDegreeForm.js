import React, { Component } from 'react';
import queryString from 'query-string';
import '../App.css';
import '../css/common-components.css';
import '../css/card.css';
import '../css/microdegree.css';
import Chip from '@material-ui/core/Chip';
import { Modal, Button, Form, Col, Badge, Card } from 'react-bootstrap';
import CHAdvertisements from './CHAdvertisements';
import CHFooter from './CHFooter';

class CHMicroDegreeForm extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
            currentWord: "",
            currentTimeInterval: 0,
            choice : this.props.choice,
            chips : [],
            degree : this.props.microDegreeSuggestions
        };
        this.updateTag = this.updateTag.bind(this);
	}

    // Dont need this for now 
	componentWillMount() {
		console.log("Component will mount called ");
    }

    componentWillReceiveProps(nextProps){
        console.log("Next props Recieved are : ", nextProps);
        this.setState({
            choice: nextProps.choice,
            degree : nextProps.microDegreeSuggestions
        }, () => {
            console.log("This . state is ", this.state);
        })
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
        var params = {
            chips : this.state.chips,
            durations : this.state.currentTimeInterval
        }
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

	render() {
        var choice = this.state.choice;
        var floatLeft = {
            'float' : 'left'
        }
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
                        <Form.Control type="number" value={this.state.currentTimeInterval} placeholder="Enter Degree Time Interval in Hours" onChange={this.updateTimeInterval} />
                        <br />
                        <Button variant="primary" type="button" onClick={this.loadSuggestions} style={floatLeft}>
                            Get MicroDegree Suggestions
                        </Button>
                        <br /><br /><br />
                    </Form>

                    {choice === 'degreeSuggestions' &&
                        <div className="microDegreeSuggestions">
                            <Card className="microDegreeSuggestionsCard">
                                <Card.Header><h4>Microdegree Suggestion 1</h4></Card.Header>
                                {
                                    this.state.degree.length > 0 ?
                                        this.state.degree.map((item, index) => {
                                            return (
                                                    <Card.Body>
                                                        <Card.Title>{item.courseName}</Card.Title>
                                                        <Card.Text className="microDegreeText">
                                                            <span className="microDegreeProvider"><b>Provider : </b>{item.provider}</span>
                                                            <span className="microDegreeDifficulty"><b>Difficulty : </b>{item.difficulty}</span>
                                                        </Card.Text>
                                                    </Card.Body>
                                                    );
                                        }) :
                                        []
                                },
                            <Button variant="primary" className="microDegreeRegister">Register For MicroDegree</Button>
                            </Card>
                        </div>
                    }
                </div>
			</div>
		);
	}
}

export default CHMicroDegreeForm;