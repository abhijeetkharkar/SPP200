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
import {updateUser, getUserDetails, getUserMicroDegree} from "../elasticSearch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser  } from '@fortawesome/free-solid-svg-icons'
import {
    doGetProfilePicture,
    doPasswordUpdate,
    doUploadProfilePicture
} from "../FirebaseUtils";
import ProfileNavigator from "./CHProfileNavigator";
import CHDeactivateCard from "./CHDeactivateCard";
import CHCourseListsCard from "./CHCourseListsCard";
import CHProfileMicroDegreeCard from "./CHProfileMicroDegreeCard";

var dateFormat = require('dateformat');
class ProfileContent extends Component {
    constructor(props, context) {
        console.log("ProfileContent Constructor");
        super(props, context);
        this.profileRef = React.createRef();

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
            favoriteList: [],
            inProgressList: [],
            completedList: [],
            old_password: "",
            new_password: "",
            confirm_password: "",
            isOpen: false,
            elastic_message: '',
            serverErrorMsg: '',
            profile_picture: '',
            microdegrees: [],
        };
        var payload = {
            query : {
                term : { Email : this.props.email }
            }
        };
        getUserDetails(payload).then(elasticResponse => {
            var id = elasticResponse.id;
            var elasticData = elasticResponse.data;
            this.setState({id: id});
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
            this.setState({favoriteList: ((elasticData.FavouriteCourses != null) ? elasticData.FavouriteCourses : [])});
            this.setState({inProgressList: ((elasticData.CoursesinProgress != null) ? elasticData.CoursesinProgress : [])});
            this.setState({completedList: ((elasticData.CoursesTaken != null) ? elasticData.CoursesTaken : [])});
            this.handleImageChange();

        }).catch(error => {
            console.log("Fetch Details ERROR:", error.message);
            this.setState({ serverErrorMsg: error.message });
            document.getElementById("fetchError").style.display = 'block';
        });

        payload = {
            query: {
                bool: {
                    must : [
                        {
                            match : {
                                userID : "nabeelahmadkhan@gmail.com"
                            }
                        }
                    ]
                }
            }
        };

        getUserMicroDegree(payload).then(elasticResponse => {
            console.log(payload);
            console.log("MicroDegree fetch response");
            console.log(elasticResponse);
            this.setState({microdegrees: elasticResponse});
        }).catch(error => {
            console.log("MicroDegree Fetch Details ERROR:", error.message);
            this.setState({ serverErrorMsg: error.message });
            document.getElementById("fetchError").style.display = 'block';
        });
    }

    componentDidMount() {
        console.log(this.props.email);
    }

    handleClick = (choice, firstName, email, queryString) => {
        this.props.updateContent(choice, firstName, email, queryString);
    };

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
                this.handleImageChange();
                alert('Profile Picture Updated Successfully!');
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
    };

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
        var customStyle = {
            marginTop: window.outerHeight * 0.11
        };
        return (
            <div className="content" style={customStyle}>
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
                                        <Form.Label>Current Password</Form.Label>
                                        <Form.Control className="password-form-control" required onChange={this.handleOldPasswordChange} type="password" placeholder="Enter Current Password" />
                                        <Form.Control.Feedback type="invalid" id="invalidCurrentPassword">{this.state.serverErrorMsg}</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridNewPassword">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control className="password-form-control" required onChange={this.handlePasswordChange} type="password" placeholder="Enter New Password" />
                                        <Form.Text className="text-muted">
                                            Minimum of 8 characters in length.
                                        </Form.Text>
                                        <Form.Control.Feedback type="invalid" id="invalidNewPassword">{this.state.serverErrorMsg}</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridConfirmPassword">
                                        <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control className="password-form-control" required onChange={this.handleConfirmPasswordChange} type="password" placeholder="Confirm New Password" />
                                        <Form.Control.Feedback type="invalid" id="invalidUsernamePwdFeedback">{this.state.serverErrorMsg}</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Button variant="primary" type="submit">
                                    Update
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                    <div className="main-content">
                        <Row>
                            <Col md={2}>
                                <ProfileNavigator profileRef={this.profileRef}/>
                            </Col>
                            <Col md={10}>
                                <div className="edit-profile-content" ref={this.props.profileRef}>
                                    <Row>
                                        <Col md={9} className="update-profile-box">
                                            <Card className="profile-edit-card">
                                                <Card.Title>Edit Profile</Card.Title>
                                                <Form className="profile-form" onSubmit={e => this.handleSubmit(e)}>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formGridfname">
                                                            <Form.Label>First Name</Form.Label>
                                                            <Form.Control className="profile-form-control" onChange={this.handleFirstNameChange} type="fname" value={this.state.firstName} minlength='1' maxlength='25' placeholder="Enter first name" />
                                                        </Form.Group>

                                                        <Form.Group as={Col} controlId="formGridlname">
                                                            <Form.Label>Last Name</Form.Label>
                                                            <Form.Control className="profile-form-control" onChange={this.handleLastNameChange} type="lname" value={this.state.lastName} minlength='1' maxlength='25' placeholder="Enter last name" />
                                                        </Form.Group>
                                                    </Form.Row>

                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formGridEmail">
                                                            <Form.Label>Email</Form.Label>
                                                            <Form.Control className="profile-form-control" type="email" value={this.state.email} disabled="true" />
                                                        </Form.Group>

                                                        <Form.Group as={Col} controlId="formGriddob">
                                                            <Form.Label>Date of Birth</Form.Label>
                                                            <Form.Control className="profile-form-control" onChange={this.handleDobChange} type="date"  value={this.state.dob} placeholder="MM/DD/YYYY" />
                                                        </Form.Group>

                                                        <Form.Group as={Col} controlId="formGridphone">
                                                            <Form.Label>Phone No.</Form.Label>
                                                            <Form.Control className="profile-form-control" onChange={this.handlePhoneChange} value={this.state.phone} type="number" min='1000000000' max='9999999999'  placeholder="1234567890" />
                                                        </Form.Group>
                                                    </Form.Row>

                                                    <Form.Group controlId="formGridAddress">
                                                        <Form.Label>Address</Form.Label>
                                                        <Form.Control as="textarea" rows="2" className="profile-form-text-area" onChange={this.handleAddressChange} type="address" value={this.state.address} />
                                                    </Form.Group>

                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formGridCity">
                                                            <Form.Label>City</Form.Label>
                                                            <Form.Control className="profile-form-control" onChange={this.handleCityChange} value={this.state.city} maxlength='50'/>
                                                        </Form.Group>

                                                        <Form.Group as={Col} controlId="formGridState">
                                                            <Form.Label>State</Form.Label>
                                                            <Form.Control className="profile-form-control" onChange={this.handleStateChange} value={this.state.state} maxlength='25'/>
                                                        </Form.Group>

                                                        <Form.Group as={Col} controlId="formGridZip">
                                                            <Form.Label>Zip</Form.Label>
                                                            <Form.Control className="profile-form-control" onChange={this.handleZipChange} value={this.state.zip_code} type="number" min='10000' max='99999' placeholder="12345"/>
                                                        </Form.Group>
                                                    </Form.Row>

                                                    <Button variant="success" type="submit">
                                                        Update
                                                    </Button>

                                                    <Button onClick={this.toggleModal} className="password-button" variant="primary" type="button">
                                                        Change Password
                                                    </Button>
                                                </Form>
                                            </Card>
                                        </Col>
                                        <Col md={3} className='profile-image-box'>
                                            <Card className='profile-image-card'>
                                                <Card.Title>Update Profile Picture</Card.Title>
                                                <div className='profile-upload'>
                                                    <label htmlFor='single'>
                                                        <img id="profile-image" src="#" alt="your image" />
                                                        <FontAwesomeIcon id='profile-icon' icon={faUser} size='5x' color='rgb(110,108,221)'/>
                                                    </label>
                                                    <br/>
                                                    <br/>
                                                    <input type='file' id='profile_picture' className="profile-picture-button" onChange={this.onDrop} title="&nbsp;"/>
                                                </div>
                                                <Button variant="success" className="profile-picture-button" onClick={this.handleImageUpload}>
                                                    Update Picture
                                                </Button>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                                <CHCourseListsCard updateContent={this.handleClick} user_id={this.state.id} email={this.state.email} favoriteList={this.state.favoriteList} inProgressList={this.state.inProgressList} completedList={this.state.completedList}/>
                                <CHProfileMicroDegreeCard email={this.state.email}/>
                                <CHDeactivateCard email={this.state.email}/>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        );
    }
}

export default ProfileContent;