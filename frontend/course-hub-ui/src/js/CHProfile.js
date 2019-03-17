import React, {Component} from 'react';
import '../css/profile.css';
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button, Modal,
} from "react-bootstrap";
import {updateUser, getUserDetails, addUser} from "../elasticSearch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser  } from '@fortawesome/free-solid-svg-icons'
import {doGetProfilePicture, doPasswordUpdate, doUploadProfilePicture} from "../FirebaseUtils";
import ProfileNavigator from "./CHProfileNavigator";

var dateFormat = require('dateformat');
class ProfilePage extends Component {
    constructor(props, context) {
        console.log("CHProfile Constructor");
        super(props, context);

        this.state = {
            id: "",
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
            old_password: "",
            new_password: "",
            confirm_password: "",
            isOpen: false,
            elastic_message: '',
            serverErrorMsg: '',
            profile_picture: '',
        };
        var payload = {
            query : {
                term : { Email : this.props.email }
            }
        };
        getUserDetails(payload).then(elasticResponse => {
            var id = elasticResponse.id;
            var elasticData = elasticResponse.data;
            this.setState({id: id})
            this.setState({firstName: ((elasticData.UserName.First != null) ? elasticData.UserName.First : '')});
            this.setState({lastName: ((elasticData.UserName.Last != null) ? elasticData.UserName.Last : '')});
            this.setState({email: ((elasticData.Email != null) ? elasticData.Email : '')});
            this.setState({dob: ((elasticData.DOB != null) ? String(dateFormat(elasticData.DOB, "isoDateTime").split('T')[0]): '')});
            this.setState({phone: ((elasticData.PhoneNo != null) ? elasticData.PhoneNo : '')});
            this.setState({address: ((elasticData.Address != null && elasticData.Address.Street != null) ? elasticData.Address.Street : '')});
            this.setState({city: ((elasticData.Address != null && elasticData.Address.City != null) ? elasticData.Address.City : '')});
            this.setState({state: ((elasticData.Address != null && elasticData.Address.State != null) ? elasticData.Address.State : '')});
            this.setState({zip_code: ((elasticData.Address != null && elasticData.Address.ZipCode != null) ? elasticData.Address.ZipCode : '')});
            this.setState({bio: ((elasticData.Bio != null) ? elasticData.Bio : "I am a greatest Software in the World of Engineer")});
            this.handleImageChange();

        }).catch(error => {
            console.log("Fetch Details ERROR:", error.message);
            this.setState({ serverErrorMsg: error.message });
            document.getElementById("fetchError").style.display = 'block';
        });
    }

    componentDidMount() {
        console.log(this.props.email);
    }

    handleSubmit = async event => {
        console.log('In Submit');
        event.preventDefault();
        try {
            updateUser(this.state.id, {
                "doc" : {
                    "Email": this.state.email,
                    "UserName": {
                        "First": this.state.firstName,
                        "Last": this.state.lastName
                    },
                    "DOB": (this.state.dob != '') ? dateFormat(new Date(new Date(this.state.dob).getTime() + 1000*60*60*24), "isoDateTime").split("T")[0]
                        : null,
                    "Address":{
                        "Street": this.state.address,
                        "City": this.state.city,
                        "State": this.state.state,
                        "ZipCode": this.state.zip_code
                    },
                    "PhoneNo": this.state.phone,
                }
            }).then(response => {
                if (response) {
                    this.props.updateContent("homeSignedIn", this.state.firstName, this.state.email, null);
                    this.setState({ elastic_message: "Profile Updated Successfully" });
                    alert("Profile Updated Successfully");
                } else {
                    this.setState({ elastic_message: "Unable to update Profile" });
                    alert("Error: Couldn't update profile");
                    console.log("Response from Elastic Search API is :", response);
                }
            });
        } catch (error) {
            this.setState({ elastic_message: error.message });
            alert("Error: Couldn't update profile");
            console.log("error is", error);
        }
    }

    handlePasswordSubmit = async event => {
        document.getElementById("invalidUsernamePwdFeedback").style.display = "None";
        document.getElementById("invalidNewPassword").style.display = "None";
        document.getElementById("invalidCurrentPassword").style.display = "None";
        event.preventDefault();
        try {
            if (this.state.new_password !== this.state.confirm_password) {
                this.setState({ serverErrorMsg: "Didn't match with new password" });
                document.getElementById("invalidUsernamePwdFeedback").style.display = "block";
            } else {
                doPasswordUpdate(this.state.old_password, this.state.new_password).then(res => {
                    if(res === "SUCCESS"){
                        this.toggleModal();
                    }
                    else if(res === "REJECTED"){
                        this.setState({ serverErrorMsg: "Password didn't meet required specifications" });
                        document.getElementById("invalidNewPassword").style.display = "block";
                    }
                    else{
                        this.setState({ serverErrorMsg: "Invalid current password" });
                        document.getElementById("invalidCurrentPassword").style.display = "block";
                    }
                })
            }
        } catch (error) {
            this.setState({ serverErrorMsg: error.message });
        }
    }

    handleImageUpload = async () => {
        console.log('In Image Submit');
        await doUploadProfilePicture(this.state.profile_picture).then(res => {
            console.log(res);
            if(res === "SUCCESS"){
                alert('Profile Picture Updated Successfully!');
                this.handleImageChange();
            }
            else{
                alert('Error');
            }
        });
    }

    toggleModal = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    onDrop = (e) => {
        console.log('In Drop');
        console.log(e.target.files[0]);
        this.setState({
            profile_picture: e.target.files[0],
        });
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
        this.setState({ dob: e.target.value});
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
        console.log('zip_code', e.target.value);
        this.setState({ zip_code: e.target.value });
    }

    handleOldPasswordChange = (e) => {
        this.setState({ old_password: e.target.value });
    }

    handlePasswordChange = (e) => {
        this.setState({ new_password: e.target.value });
    }

    handleConfirmPasswordChange = (e) => {
        this.setState({ confirm_password: e.target.value });
    }

    handleImageChange = async () => {
        var url = await doGetProfilePicture();
        console.log('Updating');
        var date = Date.now();
        var icon = document.getElementById('profile-icon');
        var img = document.getElementById('profile-image');


        if(url != null){
            img.src = url;
            img.style.height = '175px';
            img.style.width = '175px';
            img.style.display = 'block';
            icon.style.display = 'None';
        }
        else{
            img.style.display = 'none';
            icon.style.display = 'block';
        }
    };


    render() {
        return (
            <div className="content">
                <Container fluid>
                    <Modal show={this.state.isOpen}>
                        <Modal.Header>
                            <Modal.Title id="password-change-title">
                                Change Password
                            </Modal.Title>
                            <Button variant="danger" onClick={this.toggleModal}>
                                X
                            </Button>
                        </Modal.Header>
                        <Modal.Body>

                            <Form className="profile-form" onSubmit={e => this.handlePasswordSubmit(e)}>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridOldPassword">
                                        <Form.Label>CURRENT PASSWORD</Form.Label>
                                        <Form.Control className="password-form-control" required onChange={this.handleOldPasswordChange} type="password" placeholder="Enter Current Password" />
                                        <Form.Control.Feedback type="invalid" ref="invalidCurrentPassword">{this.state.serverErrorMsg}</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridNewPassword">
                                        <Form.Label>NEW PASSWORD</Form.Label>
                                        <Form.Control className="password-form-control" required onChange={this.handlePasswordChange} type="password" placeholder="Enter New Password" />
                                        <Form.Text className="text-muted">
                                            Minimum of 8 characters in length.
                                        </Form.Text>
                                        <Form.Control.Feedback type="invalid" ref="invalidNewPassword">{this.state.serverErrorMsg}</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridConfirmPassword">
                                        <Form.Label>CONFIRM NEW PASSWORD</Form.Label>
                                        <Form.Control className="password-form-control" required onChange={this.handleConfirmPasswordChange} type="password" placeholder="Confirm New Password" />
                                        <Form.Control.Feedback type="invalid" ref="invalidUsernamePwdFeedback">{this.state.serverErrorMsg}</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Button variant="primary" type="submit">
                                    Update
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                        {/*<Col md={3}>*/}
                            {/*<Card className="profile_card">*/}
                                {/*<div className='profile-picture'>*/}
                                    {/*<div className='button'>*/}
                                        {/*<label htmlFor='single'>*/}
                                            {/*<FontAwesomeIcon icon={faUser} size='5x' color='rgb(110,108,221)'/>*/}
                                        {/*</label>*/}
                                        {/*<br/>*/}
                                        {/*<input type='file' id='profile_picture' onChange={this.onDrop}/>*/}
                                    {/*</div>*/}
                                {/*</div>*/}

                                {/*<div className="profile-card-body">*/}
                                    {/*<Card.Title className="profile-card-title">*/}
                                        {/*{this.state.firstName + " " + this.state.lastName}*/}
                                    {/*</Card.Title>*/}
                                    {/*<p className="email">{this.state.email}</p>*/}
                                    {/*<p className="Bio">{this.state.bio}</p>*/}
                                {/*</div>*/}
                            {/*</Card>*/}
                        {/*</Col>*/}

                            <Card className="maincard">
                                <Row>
                                    <Col md={1}>
                                        <ProfileNavigator/>
                                    </Col>
                                    <Col md={8} className="update-profile-box">
                                        <Card className="profile-edit-card">
                                            <Card.Title className="card-title">Edit Profile</Card.Title>
                                            <Form className="profile-form" onSubmit={e => this.handleSubmit(e)}>
                                                <Form.Control.Feedback type="error" id="fetchError">{this.state.serverErrorMsg}</Form.Control.Feedback>
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
                                                    <Form.Control as="textarea" rows="1" className="profile-form-text-area" onChange={this.handleAddressChange} type="address" value={this.state.address} />
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

                                                <Button onClick={this.toggleModal} className="password-button" variant="danger" type="button">
                                                    Change Password
                                                </Button>
                                            </Form>
                                        </Card>
                                    </Col>
                                    <Col md={3} className='profile-image-box'>
                                        <Card className='profile-image-card'>
                                            <div className='profile-upload'>
                                                <label htmlFor='single'>
                                                    <img id="profile-image" src="#" alt="your image" />
                                                    <FontAwesomeIcon id='profile-icon' icon={faUser} size='5x' color='rgb(110,108,221)'/>
                                                </label>
                                                <br/>
                                                <br/>
                                                <input type='file' id='profile_picture' className="profile-picture-button" onChange={this.onDrop} title="&nbsp;"/>
                                            </div>
                                            <Button variant="primary" className="profile-picture-button" onClick={this.handleImageUpload}>
                                                Update Picture
                                            </Button>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                </Container>
            </div>
        );
    }
}

export default ProfilePage;