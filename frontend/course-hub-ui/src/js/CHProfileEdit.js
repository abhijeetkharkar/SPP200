import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
    FormGroup,
    FormControl,
    Button,
} from "react-bootstrap";
import FormInputs from "./CHFormInputs";
import Card from "./Card";

class ProfilePageEdit extends Component{
    constructor(props, context) {
        console.log("CHProfileEdit Constructor");
        super(props, context);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);

        this.state = {
            firstName : "Ali",
            lastName : "Asgher",
            email : "ali@coursehub.edu",
            dob: "",
            bio: "",
            address: "",
            city: "",
            state: "",
            zip_code: ""
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch('http://localhost:4000/profile/edit', {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'firstName': this.state.firstName,
                'lastname' : this.state.lastName,
                'email' : this.state.email,
                'password' : this.state.password,
                'confirmpassword' : this.state.confirmPassword
            })
        }).then(function(response){
            console.log("response is ", response.body, response.status);
        });
    }

    handleFirstNameChange(e) {
        this.setState({firstName: e.target.value});
    }

    handleLastNameChange(e) {
        this.setState({lastName: e.target.value});
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleConfirmPasswordChange(e) {
        this.setState({confirmPassword: e.target.value});
    }

    render() {
        return (
            <div className="content">
                <Container fluid>
                    <Row>
                        <Col md={8}>
                            <Card
                                title="Edit Profile"
                                content={
                                    <form onSubmit={e => this.handleSubmit(e)}>
                                        <FormInputs
                                            ncols={["col-md-6", "col-md-6"]}
                                            proprieties={[
                                                {
                                                    label: "First name",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    placeholder: "First name",
                                                    defaultValue: this.state.firstName
                                                },
                                                {
                                                    label: "Last name",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    placeholder: "Last name",
                                                    defaultValue: this.state.lastName
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols={["col-md-4", "col-md-4", "col-md-4"]}
                                            proprieties={[
                                                {
                                                    label: "Email address",
                                                    type: "email",
                                                    bsClass: "form-control",
                                                    placeholder: "Email",
                                                    defaultValue: this.state.email,
                                                    disabled: true
                                                },
                                                {
                                                    label: "Date of Birth",
                                                    type: "date",
                                                    bsClass: "form-control",
                                                    placeholder: "Date of Birth",
                                                    defaultValue: this.state.dob,
                                                },
                                                {
                                                    label: "Phone No.",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    placeholder: "Phone No",
                                                    defaultValue: this.state.phone
                                                }
                                            ]}
                                        />

                                        <FormInputs
                                            ncols={["col-md-12"]}
                                            proprieties={[
                                                {
                                                    label: "Address",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    placeholder: "Home Address",
                                                    defaultValue: this.state.address
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols={["col-md-4", "col-md-4", "col-md-4"]}
                                            proprieties={[
                                                {
                                                    label: "City",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    placeholder: "City",
                                                    defaultValue: this.state.city
                                                },
                                                {
                                                    label: "State",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    placeholder: "Country",
                                                    defaultValue: this.state.state
                                                },
                                                {
                                                    label: "Zip Code",
                                                    type: "number",
                                                    bsClass: "form-control",
                                                    placeholder: "ZIP Code",
                                                    defaultValue: this.state.zip_code,
                                                }
                                            ]}
                                        />

                                        <Row>
                                            <Col md={12}>
                                                <FormGroup controlId="formControlsTextarea">
                                                    <FormControl>Bio</FormControl>
                                                    <FormControl
                                                        rows="5"
                                                        componentClass="textarea"
                                                        bsClass="form-control"
                                                        placeholder="Here can be your description"
                                                        defaultValue= {this.state.bio}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button bsStyle="info" pullRight fill type="submit">
                                            Update Profile
                                        </Button>
                                        <div className="clearfix" />
                                    </form>
                                }
                            />
                        </Col>
                        <Col md={4}>
                            <Card
                                bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                                name="Mike Andrew"
                                userName="michael24"
                                description={
                                    <span>
                    "Lamborghini Mercy
                    <br />
                    Your chick she so thirsty
                    <br />
                    I'm in that two seat Lambo"
                  </span>
                                }
                                socials={
                                    <div>
                                        <Button simple>
                                            <i className="fa fa-facebook-square" />
                                        </Button>
                                        <Button simple>
                                            <i className="fa fa-twitter" />
                                        </Button>
                                        <Button simple>
                                            <i className="fa fa-google-plus-square" />
                                        </Button>
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ProfilePageEdit