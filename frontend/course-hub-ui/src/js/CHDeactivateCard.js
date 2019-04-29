import {Button, Card, Col, Form} from "react-bootstrap";
import React, {Component} from "react";
import {
    doDeleteProfilePicture,
    doDeleteUser,
    doGetProfilePicture,
    reauthenticateWithCredential
} from "../FirebaseUtils";
import {elasticDeleteUser} from "../elasticSearch";

class CHDeactivateCard extends Component {

    constructor(props, context) {
        super(props, context);
        this.state ={
            password: "",
            serverErrorMsg: "",
            elastic_message: "",
        }
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    };

    handleDeleteAccount = async (e) => {
        e.preventDefault();
        const res = await reauthenticateWithCredential(this.state.password).then(async (response) => {
            var payload = {
                query : {
                    term : { Email : this.props.email }
                }
            };
            const elastic_response = await elasticDeleteUser(payload).then(async response => {
                if (response === true){
                    console.log('Deleted from elastic search');
                    var url = await doGetProfilePicture();
                    if(url !== null){
                        await doDeleteProfilePicture();
                        console.log('Deleted profile picture');
                    }
                    return await doDeleteUser().then(async response => {
                        console.log('Deleted firebase session');
                        return response
                    });
                }
            }).catch(error => {
                this.setState({ serverErrorMsg: error.message });
                console.log('Error in deleting elastic search data. Please try later...');
                return false;
            });
            if(elastic_response === true){
                this.setState({ elastic_message: "Successfully deleted user data" });
                console.log('Time to signout');
                alert('Account Deleted... Press OK to sign out');
            }
            else{
                console.log(elastic_response);
                this.setState({ elastic_message: "Couldn't delete elastic search data" });
                alert("Couldn't delete account... Try again later");
            }
        }).catch((error) => {
            console.log(error);
            return "INVALID";
        });
        if(res === "INVALID"){
            var feedback_div = document.getElementById("invalidPassword");
            feedback_div.style.display = "block";
            feedback_div.innerText = "Invalid Password";
        }
    };

    render() {
        return(
            <div className="deactivate-content">
                <Card className="deactivate-card">
                    <Card.Title className="card-title">Delete Account</Card.Title>
                    <Card.Body>
                        <Form className="profile-form" onSubmit={this.handleDeleteAccount}>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridNewPassword">
                                    <Form.Label>Please enter your account password</Form.Label>
                                    <Form.Control className="password-form-control" required onChange={this.handlePasswordChange} style={{width: "50%"}} type="password" placeholder="Password" />
                                    <Form.Control.Feedback type="invalid" id="invalidPassword" style={{fontSize: "larger"}}>{this.state.serverErrorMsg}</Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Button variant="danger" type="submit">
                                Delete Account
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default CHDeactivateCard;

