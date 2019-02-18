import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/common-components.css';
import { MDBCol, MDBFormInline, MDBBtn, MDBIcon } from "mdbreact";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CHLandingContent extends Component {
    render() {

        return (
            <MDBCol md="7">
                <div className="input-group md-form form-sm form-1 pl-0">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-text1">
                            {/* <MDBIcon className="text-white" icon="search" /> */}
                            <FontAwesomeIcon icon="search"  color='rgb(207, 204, 19)' size='3x'/>
                        </span>
                    </div>
                    <input className="form-control my-0 py-1" type="text" placeholder="Search courses" aria-label="Search" />
                </div>
            </MDBCol>
        );
    }
}

export default CHLandingContent;