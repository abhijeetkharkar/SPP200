import {Button, Col, Image, Modal, Row} from "react-bootstrap";
import React, {Component} from "react";


class CHCompareModal extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

        }

    }

    removeItemFromModal(item){
        var parent_div = document.getElementById(item.CourseId).parentElement;
        if (parent_div && parent_div.parentElement.contains(parent_div)) {
            parent_div.parentElement.removeChild(parent_div);
        }
        this.props.removeFromModal(item);
    }

    render() {
        return(
            <Modal show={this.props.isModalOpen} >
                <Modal.Header className="compare-list-model-header">
                    List of Courses
                    <Button variant="danger" onClick={this.props.closeModal }>
                        X
                    </Button>
                </Modal.Header>
                <Modal.Body className="compare-list-model-body">
                    {
                        this.props.modalCompareList.map(item => {
                            return (
                                <div >
                                    <Row id={item.CourseId} className="modal-body-row">

                                        <Col md={3} >
                                            <Image className="modal-course-image" src={item.CourseImage || 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} />
                                        </Col>
                                        <Col md={7}>
                                            <Row className="search-course-modal-link">
                                                <a href="" onClick={ () => this.props.updateContent('coursedetails',null,null,item.CourseId)}>{item.Title}</a>
                                            </Row>
                                            <Row>
                                                {"Provider: " +  item.CourseProvider + " | Taught By: " + (item.Instructors? item.Instructors.map(item => item.InstructorName).toString(): "")}
                                                <hr/>
                                            </Row>

                                        </Col>
                                        <Col md={1}>
                                            <Button className="remove-course-modal-button" onClick={() => {this.removeItemFromModal(item)}} variant="link" >X</Button>
                                        </Col>
                                    </Row>
                                    {(this.props.modalCompareList.indexOf(item) !== (this.props.modalCompareList.length - 1)) ? (
                                        <hr style={{background: "rgb(207, 204, 19)"}}/>
                                    ) : ([])}

                                </div>
                            );
                        })
                    }
                </Modal.Body>
                <Modal.Footer className="compare-list-model-footer">
                    <Button variant="success" style={{float: "right"}} >
                        Compare
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CHCompareModal;

