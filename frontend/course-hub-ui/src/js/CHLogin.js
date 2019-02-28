import React, { Component } from 'react';
import { Modal, Button, Form, Col, Badge } from 'react-bootstrap';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../FirebaseUtils';
import {addUser} from '../elasticSearch';

class LoginPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
      validated: false,
      email: '',
      password: '',
      loggedIn: false,
      serverErrorMsg: ''
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGoogleSignin = this.handleGoogleSignin.bind(this);
  }

  componentWillMount = () => {
    this.state.show ? this.handleHide() : this.handleShow()
  }

  handleShow = () => {
    this.setState({ show: true });
  };

  handleHide = () => {
    this.setState({ show: false });
    this.props.updateContent("home", null, null, null);
  };

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  }

  handleSubmit = async e => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      this.setState({ validated: true });
    } else {
      doSignInWithEmailAndPassword(this.state.email, this.state.password).then(response => {
        // console.log("SIGN-IN USER:", response.user.email);
        this.setState({ loggedIn: true });
        this.setState({ validated: false });
        document.getElementById("invalidUsernamePwdFeedback").style.display = "none";
        this.props.updateContent("homeSignedIn", null, null, null);
      }).catch(error => {
        this.setState({ serverErrorMsg: error.message });
        document.getElementById("formGridPassword").style.borderColor = "#dc3545";
        document.getElementById("invalidUsernamePwdFeedback").style.display = "block";
        this.setState({ validated: true });
      });
    }
  }

  handleGoogleSignin = () => {
    doSignInWithGoogle().then(result => {
      var token = result.credential.accessToken;
      var email = result.additionalUserInfo.profile.email;
      var firstName = result.additionalUserInfo.profile.given_name;
      var lastName = result.additionalUserInfo.profile.family_name;
      var gender = result.additionalUserInfo.profile.gender;
      var picture = result.additionalUserInfo.profile.picture;

      var payload = {
        UserName: {
          First: firstName,
          Last: lastName
        },
        PhotoURL: picture,
        Email: email
      }

      addUser(payload).then(response => {
        // console.log("Response:", response);
        if (response) {
          this.setState({ loggedIn: true });
          document.getElementById("googleSigninError").style.display = "none";
          this.props.updateContent("homeSignedIn", null, null, null);
        } else {
          //TODO delete from Firebase as well
          throw Error("Error inserting in Elastic Search");
        }
      });
    }).catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // var email = error.email;
      // var credential = error.credential;
      this.setState({ serverErrorMsg: error.message });
      document.getElementById("googleSigninError").style.display = "block";
    });
  }

  render() {
    const { validated } = this.state;
    return (
      <Modal
        show={this.state.show}
        onHide={this.handleHide}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title">
        <Modal.Header>
          <Modal.Title size="lg" id="login-in-title">
            Login
            </Modal.Title>
          <Button variant="danger" onClick={(e) => this.props.updateContent("home", null, null, null)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate
            validated={validated}
            onSubmit={e => this.handleSubmit(e)}>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Control type="email" placeholder="Enter your email" value={this.state.email} onChange={this.handleEmailChange} />
                <Form.Control.Feedback type="invalid">Invalid Email</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Control type="password" placeholder="Enter your password" value={this.state.password} onChange={this.handlePasswordChange} />
                <Form.Control.Feedback type="invalid" id="invalidUsernamePwdFeedback">{this.state.serverErrorMsg}</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group className="float-left" as={Col} controlId="formGridSignIn">
                <Button size="lg" variant="success" type="submit">Login</Button>
              </Form.Group>
              <Form.Group className="float-right text-right" as={Col} controlId="formGridForgot">
                <Button variant="link">Forgot Password?</Button>
              </Form.Group>
            </Form.Row>
            <Form.Row className="text-center">
              <Form.Group className="float-center" as={Col} controlId="formGridGoogleSignIn">
                <h2><Badge pill variant="info">OR</Badge></h2>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group className="text-center" as={Col} controlId="formGridGoogleSignIn">
                <GoogleLoginButton align="center" onClick={this.handleGoogleSignin} />
                <Form.Control.Feedback type="invalid" id="googleSigninError">{this.state.serverErrorMsg}</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group className="float-right text-right" as={Col} controlId="formGridSignUp">
                New User? <Button variant="link" onClick={(e) => this.props.updateContent("signupScreen", null, null, null)}>Register</Button>
              </Form.Group>
            </Form.Row>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

export default LoginPage;