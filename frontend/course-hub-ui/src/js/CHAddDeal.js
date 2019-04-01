import React from 'react';
import { Button, Form, Col } from 'react-bootstrap';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import '../css/card.css';


class CHAddDeal extends React.Component {

  constructor(props, context){
    super(props, context);
    this.state = {
        show: false,
        validated: false,
        title: "",
        description : "",
        link: "",
        imageLink: "",
        originalPrice: "",
        discountedPrice: "",
        thumbsUp: 0, 
        datePosted: (new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2)),
        dealExpiry: ((new Date().getFullYear() + 1) + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2)),
        user: "",
        provider: "",
        serverErrorMsg: ''
    }
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.handleImageLinkChange = this.handleImageLinkChange.bind(this);
    this.handleOriginalPriceChange = this.handleOriginalPriceChange.bind(this);
    this.handleDiscountedPriceChange = this.handleDiscountedPriceChange.bind(this);
    this.handleDealExpiryChange = this.handleDealExpiryChange.bind(this);
    this.handleProviderChange = this.handleProviderChange.bind(this);

    console.log("DATE POSTED  ",this.state.datePosted);
  }

  handleTitleChange(event) {
      this.setState({
          title: event.target.value
      });
  }

  handleDescriptionChange(event) {
      this.setState({
          description: event.target.description
      })
  }

  handleLinkChange(event) {
        this.setState({
            link: event.target.link
        })
  }

  handleImageLinkChange(event){
      this.setState({
          imageLink: event.target.imageLink
      })
  }

  handleOriginalPriceChange(event){
      this.setState({
          originalPrice: event.target.originalPrice
      })
  }

  handleDiscountedPriceChange(event){
    this.setState({
        discountedPrice: event.target.discountedPrice
    })
  }

  handleDealExpiryChange(event){
      this.setState({
          dealExpiry: event.target.dealExpiry
      })
  }

  handleProviderChange(event){
      this.setState({
          provider: event.target.provider
      })
  }

  handleSubmit(event) {
      event.preventDefault();
      console.log("HANDLE SUBMIT FUNCTION CALLED");
      console.log("Event Generated is ", event);
      
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
                    {/* <Form.Control required value={this.state.description} onChange={this.handleDescriptionChange} type="text" placeholder="Description" /> */}
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
                <Form.Group as={Col} controlId="formGridImageLink">
                    <Form.Control required value={this.state.imageLink} onChange={this.handleImageLinkChange} type="url" placeholder="Image-Link" />
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