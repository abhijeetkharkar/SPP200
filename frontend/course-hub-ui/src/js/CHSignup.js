import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import { Modal, Button, Form, Col, Row, Badge } from 'react-bootstrap';
import { GoogleLoginButton } from "react-social-login-buttons";

class SignupPage extends Component {
  constructor(props, context) {
    console.log("CHSignup Constructor")
    super(props, context);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);

    this.state = {
      show: false,
      validated: false,
      firstName : "",
      lastName : "",
      email : "",
      password : "",
      confirmPassword: ""
    };

    this.handleShow = () => {
      this.setState({ show: true });
    };

    this.handleHide = () => {
      this.setState({ show: false });
    };
  }

  handleSubmit(event) {
    console.log("CHSignup HandleSubmit", this.state.firstName);
    // alert("handle submit hit ");
    event.preventDefault();
    
    fetch('http://localhost:4000/signup', {
      mode: 'no-cors',
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        'firstName': 'sample-test'
      })
    }).then(function(response){
      console.log("response is ", response.body, response.status);
    });
  }

  componentDidMount() {
    this.state.show ? this.handleHide() : this.handleShow()
  }
  
  handleFirstNameChange(e) {
    this.setState({firstName: e.target.value});
  }

  render() {
    console.log("Inside CHSignup Render")
    const { validated } = this.state;
    return (
        <Modal
          show={this.state.show}
          /* onHide={[this.handleHide]} */
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title">
          <Modal.Header>
            <Modal.Title id="sign-up-title">
              SignUp
            </Modal.Title>            
            <Button variant="danger" onClick={(e) => this.props.updateContent("home",null, null, null)}>
              X
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={e => this.handleSubmit(e)}>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridFirstName">
                  <Form.Control required value={this.state.firstName} onChange={this.handleFirstNameChange} type="text" placeholder="First Name" />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridLastName">
                  <Form.Control required type="text" placeholder="Last Name" />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Control required type="email" placeholder="Enter email" />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Control required type="password" placeholder="Password" />
                  <Form.Control.Feedback>Looks Nice!</Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Minimum of 8 characters in length.
                  </Form.Text>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridConfirmPassword">
                  <Form.Control required type="password" placeholder="Confirm Password" />
                  <Form.Control.Feedback>Looks Nice!</Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group className="float-left" as={Col} controlId="formGridSignUp">
                  <Button variant="success" type="Sign-Up">Sign-Up</Button>
                </Form.Group>
              </Form.Row>
            </Form>
          </Modal.Body>
        </Modal>
    );
  }
}

export default SignupPage;