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
      <>
        {/* <Button variant="primary" onClick={this.handleShow}>
          Custom Width Modal
        </Button> */}

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
                  New User? <Button variant="link">Register</Button>
                </Form.Group>
              </Form.Row>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

/* const LoginPage = () => {
  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody className="mx-4">
              <div className="text-center">
                <h3 className="dark-grey-text mb-5">
                  <strong>Sign in</strong>
                </h3>
              </div>
              <MDBInput
                label="Your email"
                group
                type="email"
                validate
                error="wrong"
                success="right"
              />
              <MDBInput
                label="Your password"
                group
                type="password"
                validate
                containerClass="mb-0"
              />
              <p className="font-small blue-text d-flex justify-content-end pb-3">
                Forgot
                <a href="#!" className="blue-text ml-1">

                  Password?
                </a>
              </p>
              <div className="text-center mb-3">
                <MDBBtn
                  type="button"
                  gradient="blue"
                  rounded
                  className="btn-block z-depth-1a"
                >
                  Sign in
                </MDBBtn>
              </div>
              <p className="font-small dark-grey-text text-right d-flex justify-content-center mb-3 pt-2">

                or Sign in with:
              </p>
              <div className="row my-3 d-flex justify-content-center">
                <MDBBtn
                  type="button"
                  color="white"
                  rounded
                  className="mr-md-3 z-depth-1a"
                >
                  <MDBIcon fab icon="facebook-f" className="blue-text text-center" />
                </MDBBtn>
                <MDBBtn
                  type="button"
                  color="white"
                  rounded
                  className="mr-md-3 z-depth-1a"
                >
                  <MDBIcon fab icon="twitter" className="blue-text" />
                </MDBBtn>
                <MDBBtn
                  type="button"
                  color="white"
                  rounded
                  className="z-depth-1a"
                >
                  <MDBIcon fab icon="google-plus-g" className="blue-text" />
                </MDBBtn>
              </div>
            </MDBCardBody>
            <MDBModalFooter className="mx-5 pt-3 mb-1">
              <p className="font-small grey-text d-flex justify-content-end">
                Not a member?
                <a href="#!" className="blue-text ml-1">

                  Sign Up
                </a>
              </p>
            </MDBModalFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}; */

export default LoginPage;