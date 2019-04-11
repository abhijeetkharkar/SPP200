import React, { Component } from 'react';
import { Modal, Button, Form, Col, Badge, Overlay, Tooltip } from 'react-bootstrap';
import { doPasswordReset } from '../FirebaseUtils';

class ForgotPasswordPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
      showMessage: false,
      validated: false,
      email: '',
      serverMsg: ''
    };

    this.attachRef = target => this.setState({ target });
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount = () => {
    this.state.show ? this.handleHide() : this.handleShow()
  }

  handleShow = () => {
    this.setState({ show: true });
  };

  handleHide = () => {
    this.setState({ show: false });
    this.props.updateContent("home", null, null, this.props.searchString != undefined? this.props.searchString: null, this.props.courseId || '');
  };

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  }

  handleSubmit = async e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      this.setState({ validated: true });
    } else {
      doPasswordReset(this.state.email).then(response => {
        this.setState({ showMessage: true, serverMsg: "Password Reset Email sent successfully. Please check your mailbox." });
      }).catch(error => {
        this.setState({ showMessage: true, serverMsg: "Please try again later" });
      });
    }
  }

  render() {
    const { validated } = this.state;
    const { showMessage, target } = this.state;
    return (
      <Modal
        show={this.state.show}
        onHide={this.handleHide}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title">
        <Modal.Header>
          <Modal.Title size="lg" id="login-in-title">
            Forgot Password?
            </Modal.Title>
          <Button id="forgotPasswordCloseButton" variant="danger" onClick={(e) => this.props.updateContent("home", null, null, this.props.searchString != undefined? this.props.searchString: null, this.props.courseId || '')}>
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
              <Form.Group className="float-left" as={Col} controlId="formGridSignIn">
                <Button ref={this.attachRef} size="lg" variant="success" type="submit">Send Email</Button>
                <Overlay target={target} show={showMessage} placement="right">
                  {props => (
                    <Tooltip id="passwordResetOverlay" {...props}>
                      {this.state.serverMsg}
                    </Tooltip>
                  )}
                </Overlay>
              </Form.Group>
            </Form.Row>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ForgotPasswordPage;