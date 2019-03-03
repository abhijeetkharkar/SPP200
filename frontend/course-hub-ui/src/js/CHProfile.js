import React, {Component} from 'react';
import '../css/profile.css';
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
} from "react-bootstrap";
import {updateUser, getUserDetails} from "../elasticSearch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser  } from '@fortawesome/free-solid-svg-icons'

var dateFormat = require('dateformat');
class ProfilePage extends Component {
    constructor(props, context) {
        console.log("CHProfile Constructor");
        super(props, context);

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            dob: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zip_code: "",
            bio: "",
            password: "",
            confirmPassword: "",
        };
        var payload = {
            query : {
                term : { Email : this.props.email }
            }
        };
        getUserDetails(payload).then(elasticData => {
            this.setState({firstName: ((elasticData.UserName.First != null) ? elasticData.UserName.First : '')});
            this.setState({lastName: ((elasticData.UserName.Last != null) ? elasticData.UserName.Last : '')});
            this.setState({email: ((elasticData.Email != null) ? elasticData.Email : '')});
            this.setState({dob: ((elasticData.date_of_birth != null) ? dateFormat(elasticData.date_of_birth, "isoDateTime").split('T')[0] : dateFormat(new Date('01/01/1996'), "isoDateTime").split('T')[0])});
            this.setState({phone: ((elasticData.phone_no != null) ? elasticData.phone_no : '319-123-4567')});
            this.setState({address: ((elasticData.address != null) ? elasticData.address : '711 Carriage Hill')});
            this.setState({city: ((elasticData.city != null) ? elasticData.city : 'Iowa City')});
            this.setState({state: ((elasticData.state != null) ? elasticData.state : 'IA')});
            this.setState({zip_code: ((elasticData.zip_code != null) ? elasticData.zip_code : '52246')});
            this.setState({bio: ((elasticData.bio != null) ? elasticData.bio : "I am a greatest Software in the World of Engineer")});
            this.setState({password: ((elasticData.password != null) ? elasticData.password : "Don't know")});

        }).catch(error => {
            console.log("Fetch Details ERROR:", error.message);
            this.setState({ serverErrorMsg: error.message });
            this.setState({ validated: true });
        });
    }

    componentDidMount() {
        console.log(this.props.email);
    }

    handleSubmit = async event => {
        console.log('In Submit');
        event.preventDefault();
        try {
            updateUser({
                "Email": this.state.email,
                "UserName": {
                    "First": this.state.firstName,
                    "Last": this.state.lastName
                },
                "DOB": this.state.dob,
                "Address":{
                    "Street": this.state.address,
                    "City": this.state.city,
                    "State": this.state.state,
                    "ZipCode": this.state.zip_code
                },
                "PhoneNo": this.state.phone,

            }).then(response => {
                if (response) {
                    console.log("User details updated successfully");
                    //this.props.updateContent("profile", null, this.state.email, null);
                } else {
                    this.setState({ serverErrorMsg: "Unable to update User Profile." });
                    console.log("Response from Elastic Search API is :", response);
                }
            });
        } catch (error) {
            this.setState({ serverErrorMsg: error.message });
            document.getElementById("invalidUsernamePwdFeedback").style.display = "block";
            console.log("error is", error);
        }
    }

    handleFirstNameChange = (e) => {
        console.log('fname', e.target.value);
        this.setState({ firstName: e.target.value });
    }

    handleLastNameChange = (e) => {
        console.log('lname', e.target.value);
        this.setState({ lastName: e.target.value });
    }

    handleDobChange = (e) => {
        console.log('dob', e.target.value);
        this.setState({ dob: dateFormat(e.target.value, "isoDateTime").split('T')[0]});
    }

    handlePhoneChange = (e) => {
        console.log('phone', e.target.value);
        this.setState({ phone: e.target.value });
    }

    handleAddressChange = (e) => {
        console.log('address', e.target.value);
        this.setState({ address: e.target.value });
    }

    handleCityChange = (e) => {
        console.log('city', e.target.value);
        this.setState({ city: e.target.value });
    }

    handleStateChange = (e) => {
        console.log('state', e.target.value);
        this.setState({ state: e.target.value });
    }

    handleZipChange = (e) => {
        console.log('zip', e.target.value);
        this.setState({ zip: e.target.value });
    }


    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    }


    render() {
        return (
            <div className="content">
                <Container fluid>
                    <Row>
                        <Col md={4}>
                            <Card className="profile_card">
                                <div className='profile-picture'>
                                    <div className='button'>
                                        <label htmlFor='single'>
                                            <FontAwesomeIcon icon={faUser} size='5x' color='rgb(110,108,221)'/>
                                        </label>
                                        <br/>
                                        <input type='file' id='single'/>
                                    </div>
                                </div>

                                <div className="profile-card-body">
                                    <Card.Title className="profile-card-title">
                                        {this.state.firstName + " " + this.state.lastName}
                                    </Card.Title>
                                    <p className="email">{this.state.email}</p>
                                    <p className="Bio">{this.state.bio}</p>
                                </div>
                            </Card>
                        </Col>

                        <Col md={8}>
                            <Card className="profile-edit-card">
                                <Card.Title className="card-title">Edit Profile</Card.Title>
                                <Form className="profile-form" onSubmit={e => this.handleSubmit(e)}>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formGridfname">
                                            <Form.Label>FIRST NAME</Form.Label>
                                            <Form.Control className="profile-form-control" onChange={this.handleFirstNameChange} type="fname" value={this.state.firstName} placeholder="Enter first name" />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridlname">
                                            <Form.Label>LAST NAME</Form.Label>
                                            <Form.Control className="profile-form-control" onChange={this.handleLastNameChange} type="lname" value={this.state.lastName} placeholder="Enter last name" />
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formGridEmail">
                                            <Form.Label>EMAIL</Form.Label>
                                            <Form.Control className="profile-form-control" type="email" value={this.state.email} disabled="true" />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGriddob">
                                            <Form.Label>DATE OF BIRTH</Form.Label>
                                            <Form.Control className="profile-form-control" onChange={this.handleDobChange} type="dob" value={this.state.dob} placeholder="MM/DD/YYYY" />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridphone">
                                            <Form.Label>PHONE NO.</Form.Label>
                                            <Form.Control className="profile-form-control" onChange={this.handlePhoneChange} type="phone" value={this.state.phone} placeholder="123-456-7890" />
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Group controlId="formGridAddress">
                                        <Form.Label>ADDRESS</Form.Label>
                                        <Form.Control className="profile-form-control" onChange={this.handleAddressChange} value={this.state.address} />
                                    </Form.Group>

                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formGridCity">
                                            <Form.Label>CITY</Form.Label>
                                            <Form.Control className="profile-form-control" onChange={this.handleCityChange} value={this.state.city}/>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridState">
                                            <Form.Label>STATE</Form.Label>
                                            <Form.Control className="profile-form-control" onChange={this.handleStateChange} value={this.state.state} />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridZip">
                                            <Form.Label>ZIP</Form.Label>
                                            <Form.Control className="profile-form-control" onChange={this.handleZipChange} value={this.state.zip_code} />
                                        </Form.Group>
                                    </Form.Row>

                                    <Button variant="primary" type="submit">
                                        Update
                                    </Button>

                                    <Button className="password-button" variant="danger" type="button">
                                        Change Password
                                    </Button>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ProfilePage;