import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import { Modal, Button, Form, Col, Row, Badge } from 'react-bootstrap';
import { GoogleLoginButton } from "react-social-login-buttons";

class LoginPage extends Component {
  constructor(props, context) {
    console.log("CHLogin Constructor")
    super(props, context);

    this.state = {
      show: false,
      validated: false,
    };

    this.handleShow = () => {
      this.setState({ show: true });
    };

    this.handleHide = () => {
      this.setState({ show: false });
    };
  }

  handleSubmit(event) {
    console.log("CHLogin HandleSubmit")
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
  }

  componentDidMount() {
    this.state.show ? this.handleHide() : this.handleShow()
  }

  render() {
    console.log("Inside CHLogin Render")
    const { validated } = this.state;
    return (
        <Modal
          show={this.state.show}
          /* onHide={[this.handleHide]} */
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header>
            <Modal.Title size="lg" id="login-in-title">
              Login
            </Modal.Title>            
            <Button variant="danger" onClick={(e) => this.props.updateContent("home",null, null, null)}>
              X
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Control type="email" placeholder="Enter email" />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Control type="password" placeholder="Password" />
                  <Form.Control.Feedback>Looks Nice!</Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group className="float-left" as={Col} controlId="formGridSignIn">
                  <Button size="lg" variant="success" type="Login">Login</Button>
                </Form.Group>
                <Form.Group className="float-right text-right" as={Col} controlId="formGridForgot">
                  <Button variant="link">Forgot Password?</Button>
                </Form.Group>
              </Form.Row>
              <Form.Row className="text-center">
                <Form.Group className="float-center" as={Col} controlId="formGridGoogleSignIn">
                  <h1><Badge pill variant="info">OR</Badge></h1>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group className="float-center" as={Col} controlId="formGridGoogleSignIn">
                  <GoogleLoginButton align="center" onClick={() => alert("Hello")} />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group className="float-right text-right" as={Col} controlId="formGridSignUp">
                  New User? <Button variant="link" onClick={(e) => this.props.updateContent("signupScreen",null, null, null)}>Register</Button>
                </Form.Group>
              </Form.Row>
            </Form>
          </Modal.Body>
        </Modal>
    );
  }
}

export default LoginPage;