import React, {Component} from 'react';
import '../css/profile.css';
import {
    Container,
    Row,
    Col,
} from "react-bootstrap";
import Card from "./Card";
import FormInputs from "./CHFormInputs";

class ProfilePage extends Component {
    constructor(props, context) {
        console.log("CHProfile Constructor");
        super(props, context);
    }
    render() {
        return (
            <div className="content">
                <Container fluid>
                    <Row>
                        <Col md={8}>
                            <Card title="User Profile"
                                  content={
                                      <form>
                                          <FormInputs
                                              ncols={["col-md-6", "col-md-6"]}
                                              proprieties={[
                                                  {
                                                      label: "First name",
                                                      type: "text",
                                                      bsClass: "form-control",
                                                      placeholder: "First name",
                                                      defaultValue: "Ali"
                                                  },
                                                  {
                                                      label: "Last name",
                                                      type: "text",
                                                      bsClass: "form-control",
                                                      placeholder: "Last name",
                                                      defaultValue: "Asgher"
                                                  }
                                              ]}
                                          />
                                      </form>
                                  }
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ProfilePage;