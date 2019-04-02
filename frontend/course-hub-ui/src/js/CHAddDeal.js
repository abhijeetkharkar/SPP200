import React, { Component } from 'react';
import { Button, Form, Col } from 'react-bootstrap';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import '../css/card.css';
import {addDeal, addUser} from '../elasticSearch';

class CHAddDeal extends Component {
  constructor(props, context){
    super(props, context);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.handleOriginalPriceChange = this.handleOriginalPriceChange.bind(this);
    this.handleDiscountedPriceChange = this.handleDiscountedPriceChange.bind(this);
    this.handleDealExpiryChange = this.handleDealExpiryChange.bind(this);
    this.handleProviderChange = this.handleProviderChange.bind(this);

    this.state = {
        validated: false,
        title: "",
        description : "",
        link: "",
        imageLink: "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fudemy.png?alt=media&token=0baa8ef1-3f79-4be9-b96e-20fccd7934c8",
        originalPrice: "",
        discountedPrice: "",
        thumbsUp: 0, 
        datePosted: (new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2)),
        dealExpiry: ((new Date().getFullYear() + 1) + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2)),
        user: "",
        provider: "Udemy",
        serverErrorMsg: ''
    }

    console.log("DATE POSTED  ",this.state.datePosted);
  }

  handleTitleChange(event) {
      this.setState({
          title: event.target.value
      });
  }

  handleDescriptionChange(event) {
      this.setState({
          description: event.target.value
      });
  }

  handleLinkChange(event) {
        this.setState({
            link: event.target.value
        });
  }

  handleOriginalPriceChange(event){
      this.setState({
          originalPrice: event.target.value
      });
  }

  handleDiscountedPriceChange(event){
    this.setState({
        discountedPrice: event.target.value
    });
  }

  handleDealExpiryChange(event){
      this.setState({
          dealExpiry: event.target.value
      });
  }

  handleProviderChange(event){
      this.setState({
          provider: event.target.value
      });
      if (event.target.value == "PluralSight"){
          this.setState({ imageLink: "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fpluralsight.png?alt=media&token=08635c9a-5b85-4bfb-8334-0fe6fc9dfd97"});
      }else if(event.target.value == "Udemy"){
          this.setState({ imageLink: "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fudemy.png?alt=media&token=0baa8ef1-3f79-4be9-b96e-20fccd7934c8"});
      }else if(event.target.value == "EDX"){
          this.setState({ imageLink: "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fedx.jpg?alt=media&token=713c5220-222a-402a-b8d3-d7ba9db15991"});
      }else if(event.target.value == "Coursera"){
        this.setState({ imageLink: "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fcoursera.png?alt=media&token=42504f25-018c-4084-b3ed-b556a0d8c400"});
      }else if(event.target.value == "Udacity"){
        this.setState({ imageLink: "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fudacity.jpg?alt=media&token=fbfe7041-eb87-4bde-bfd5-181e0c9a1487"});
      }else if(event.target.value == "Iversity"){
        this.setState({ imageLink: "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fiversity.png?alt=media&token=a08c29dd-cf68-43c5-8207-5566f55b4207"});
      }else if(event.target.value == "Open Learning"){
        this.setState({ imageLink: "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2FOpenLearning.png?alt=media&token=8afe1c0c-677b-437c-a6bc-c66c01590340"});
      }else{
        this.setState({ imageLink: "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2F276*180px.svg?alt=media&token=0d8e5d9d-9087-4135-944b-fe9b87b96fb0"});
      }
  }

  handleSubmit = async event => {
      event.preventDefault();
      console.log("HANDLE SUBMIT FUNCTION CALLED");
      console.log("Event Generated is ", event);
      console.log("STATE IS ", this.state);

      try{
        const deal = {
            "title" : this.state.title,
            "description" : this.state.description,
            "link" : this.state.link,
            "imageLink" : this.state.imageLink,
            "originalPrice" : this.state.originalPrice,
            "discountedPrice" : this.state.discountedPrice,
            "thumbsUp" : 0,
            "datePosted" : this.state.datePosted,
            "dealExpiry" : this.state.dealExpiry,
            "user" : "dummyUser",
            "provider" : this.state.provider
        };
        console.log("DEAL IS ", deal);
        addDeal(deal)
        .then(response => {
            if (response == true){
                console.log("Deal Successfully added");
                this.props.updatePage(response);
            }else{
                console.log("Cannot Add Deal");
                this.props.updatePage(response);
            }
        });
      }catch(error){
          console.log("Error found is ", error);
      }
  }

  render() {
    const { validated } = this.state;
    const add_deals = {
        'float': 'left'
    };
    const deals_heading = {
        'float' : 'left',
        'color' : '#505050'
    }
    return (
        <div className="add-deals">
            <h4 style={deals_heading}> ADD NEW COURSE DEALS </h4>
            <br /><br />
            <Form onSubmit={e => this.handleSubmit(e)}>
                <Form.Row>
                <Form.Group as={Col} controlId="formGridTitle">
                    <Form.Control required value={this.state.title} onChange={this.handleTitleChange} type="text" minlength='5' maxlength='80' placeholder="Title" />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group as={Col} controlId="formGridDescription">
                    <Form.Control required value={this.state.description} onChange={this.handleDescriptionChange} as="textarea" rows="4" minlength='50' maxlength='1000' placeholder="Description" />                
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group as={Col} controlId="formGridLink">
                    <Form.Control required value={this.state.link} onChange={this.handleLinkChange} type="url" placeholder="Deal Web-Link" />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Text className="text-muted" style={add_deals}>
                    Enter Complete link in the form http://www.course-hub/deals
                    </Form.Text>
                </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group as={Col} controlId="formGridOriginalPrice">
                    <Form.Control required value={this.state.originalPrice} onChange={this.handleOriginalPriceChange} type="number" min='1' max='10000' placeholder="Original Price" />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group as={Col} controlId="formGridDiscountedPrice">
                    <Form.Control required value={this.state.discountedPrice} onChange={this.handleDiscountedPriceChange} type="number" min='1' max='10000' placeholder="Discounted Price" />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group as={Col} controlId="formGridDatePosted">
                    <Form.Label style={add_deals}>Deal Expiry Date</Form.Label>
                    <Form.Control required value={this.state.dealExpiry} onChange={this.handleDealExpiryChange} type="date" placeholder='YYYY-MM-DD' min={this.state.datePosted} />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group as={Col} controlId="formGridProvider">
                    <Form.Label style={add_deals}>Course Provider</Form.Label>
                    <Form.Control required value={this.state.provider} onChange={this.handleProviderChange} as="select">
                        <option>Udemy</option>
                        <option>EDX</option>
                        <option>Coursera</option>
                        <option>PluralSight</option>
                        <option>Udacity</option>
                        <option>Iversity</option>
                        <option>Open Learning</option>
                    </Form.Control>
                </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group className="float-left" as={Col} controlId="formGridAddNewDeal">
                    <Button variant="success" type="submit" style={add_deals}>Add New Deal</Button>
                </Form.Group>
                </Form.Row>
            </Form>
        </div>
    );
    }
}

export default CHAddDeal;