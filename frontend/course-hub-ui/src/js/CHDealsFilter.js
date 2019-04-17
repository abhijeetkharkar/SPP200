import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/search.css';
import { Modal, Button, Form, Col, Badge, ButtonToolbar } from 'react-bootstrap';


class CHDealsFilters extends Component {

    constructor(props) {
        super(props);
        this.componentWillMount=()=>{
            this.selectedproviders=new Set();
        }
        this.state = {
            dealCategory: new Set([]),
        };
    }

    render() {
        var customStyle = {
            // height: "75vh",
            marginTop: window.outerHeight * 0.11,
            'backgroundColor': '#6b6d70',
            'borderColor': '#5f6163'
        }
        var headingstyle = {
            'fontSize': '20px',
            'color': '#FFFFFF'
        }
        var left_lane_deals = {
            'color': '#FFFFFF'
        }

        return (
            <div className="left-lane" style={customStyle} >
                <div className="left_lane_deals">
                    <b style={headingstyle}>Category</b><br />
                    <hr />
                    <a href="#" style={left_lane_deals} id="all-deals" onClick={e => this.props.updateDeals('all')}>All Deals</a><br />
                    <a href="#" style={left_lane_deals} id="general-deals" onClick={e => this.props.updateDeals('General')}>General</a><br />
                    <a href="#" style={left_lane_deals} id="computerscience-deals" onClick={e => this.props.updateDeals('Computer Science')}>Computer Science</a><br />
                    <a href="#" style={left_lane_deals} id="business-deals" onClick={e => this.props.updateDeals('Business')}>Business</a><br />
                    <a href="#" style={left_lane_deals} id="humanities-deals" onClick={e => this.props.updateDeals('Humanities')}>Humanities</a><br />
                    <a href="#" style={left_lane_deals} id="datascience-deals" onClick={e => this.props.updateDeals('Data Science')}>Data Science</a><br />
                    <a href="#" style={left_lane_deals} id="personaldevelopment-deals" onClick={e => this.props.updateDeals('Personal Development')}>Personal Development</a><br />
                    <a href="#" style={left_lane_deals} id="artanddesign-deals" onClick={e => this.props.updateDeals('Art & Design')}>Art & Design</a><br />
                    <a href="#" style={left_lane_deals} id="programming-deals" onClick={e => this.props.updateDeals('Programming')}>Programming</a><br />
                    <a href="#" style={left_lane_deals} id="engineering-deals" onClick={e => this.props.updateDeals('Engineering')}>Engineering</a><br />
                    <a href="#" style={left_lane_deals} id="healthandscience-deals" onClick={e => this.props.updateDeals('Health & Science')}>Health & Science</a><br />
                    <a href="#" style={left_lane_deals} id="mathematics-deals" onClick={e => this.props.updateDeals('Mathematics')}>Mathematics</a><br />
                    <a href="#" style={left_lane_deals} id="science-deals" onClick={e => this.props.updateDeals('Science')}>Science</a><br />
                    <a href="#" style={left_lane_deals} id="socialscience-deals" onClick={e => this.props.updateDeals('Social Science')}>Social Science</a><br />
                    <a href="#" style={left_lane_deals} id="educationandteaching-deals" onClick={e => this.props.updateDeals('Education & Teaching')}>Education & Teaching</a><br />
                    <br /><br />
                    <div className="add-course-deals">
                        <ButtonToolbar>
                            <Button variant="light" id="dealSubmitButton" onClick={(e) => this.props.updatePage('addnewdeal')}>Add Course Deals</Button>
                        </ButtonToolbar>
                    </div>
                </div>
            </div>
        );
    }
}


export default CHDealsFilters;
