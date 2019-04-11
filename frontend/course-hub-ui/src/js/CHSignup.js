import React, { Component } from 'react';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import { doSignInWithEmailAndPassword, doCreateUserWithEmailAndPassword, doDeleteUser } from '../FirebaseUtils';
import {addUser, searchUser} from '../elasticSearch';

class SignupPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);

    this.state = {
      show: false,
      validated: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      serverErrorMsg: ''
    };

    this.handleShow = () => {
      this.setState({ show: true });
    };

    this.handleHide = () => {
      this.setState({ show: false });
    };
  }

  handleSubmit = async event => {
    event.preventDefault();
    const errorMessage = "User Account already present.";
    try {
      var payloadSearch = {
        query : {
            term : { Email : this.state.email }
        }
      }
      if (this.state.password != this.state.confirmPassword){
        this.setState({ serverErrorMsg: "Password not matching" });
        document.getElementById("invalidUsernamePwdFeedback").style.display = "block";
      }else{
        searchUser(payloadSearch)
        .then( user => {
          if (user){
            this.setState({ serverErrorMsg: errorMessage });
            document.getElementById("invalidUsernamePwdFeedback").style.display = "block";
          }else{
            doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(user => {
              return doSignInWithEmailAndPassword(this.state.email, this.state.password)
            })
            .then(user => {
              // Creating User Profile in Elastic Search Database
              var today = new Date();
              var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
              
              return addUser({
                "Email": this.state.email,
                "UserName": {
                  "First": this.state.firstName,
                  "Last": this.state.lastName
                },
                "JoiningDate": date,
                "CoursesTaken": [],
                "FavouriteCourses": []
              })
            })
            .then(response => {
              if (response) {
                console.log("User successfully created ", response);
                this.props.updateContent("homeSignedIn", this.state.firstName, null, this.props.searchString != undefined? this.props.searchString: null);
              } else {
                // Deleting account in Firebase if Elastic Search Update fails
                console.log("User successfully created 2");
                doDeleteUser().then(deleteResponse => {
                  console.log("DELETE:", deleteResponse);
                  this.setState({ serverErrorMsg: "Unable to sign-up now." });
                  this.props.updateContent("loginScreen", null, null, this.props.searchString != undefined? this.props.searchString: null);
                  document.getElementById("invalidUsernamePwdFeedback").style.display = "block";
                }).catch(error => {
                  console.log("erorr is ", error);
                  // TODO Needs to be reported to the Course-Hub team
                  // console.log("This needs to be handled");
                });
              }
            });
        }});
      }
    }catch (error) {
      this.setState({ serverErrorMsg: error.message });
      document.getElementById("invalidUsernamePwdFeedback").style.display = "block";
      // console.log("error is", error);
    }
  }

  componentWillMount() {
    this.state.show ? this.handleHide() : this.handleShow()
  }

  handleFirstNameChange(e) {
    this.setState({ firstName: e.target.value });
  }

  handleLastNameChange(e) {
    this.setState({ lastName: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleConfirmPasswordChange(e) {
    this.setState({ confirmPassword: e.target.value });
  }

  render() {
    const { validated } = this.state;
    return (
      <Modal
        show={this.state.show}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title">
        <Modal.Header>
          <Modal.Title id="sign-up-title">
            SignUp
            </Modal.Title>
          <Button variant="danger" onClick={(e) => this.props.updateContent("home", null, null, this.props.searchString != undefined? this.props.searchString: null)}>
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
                <Form.Control required value={this.state.lastName} onChange={this.handleLastNameChange} type="text" placeholder="Last Name" />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Control required value={this.state.email} onChange={this.handleEmailChange} type="email" placeholder="Enter email" />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                  </Form.Text>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Control required value={this.state.password} onChange={this.handlePasswordChange} type="password" placeholder="Password" />
                <Form.Control.Feedback>Looks Nice!</Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Minimum of 8 characters in length.
                  </Form.Text>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridConfirmPassword">
                <Form.Control required value={this.state.confirmPassword} onChange={this.handleConfirmPasswordChange} type="password" placeholder="Confirm Password" />
                <Form.Control.Feedback type="invalid" id="invalidUsernamePwdFeedback">{this.state.serverErrorMsg}</Form.Control.Feedback>
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