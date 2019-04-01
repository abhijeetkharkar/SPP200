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
        
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.applyfilter = this.applyfilter.bind(this);
    }

    handleCategoryChange = e => {
        if(this.selectedCategory.has(e.currentTarget.id)){
            this.selectedCategory.delete(e.currentTarget.id)
        }
        else{
            this.selectedproviders.add(e.currentTarget.id)
        }
        this.setState({courseproviders : this.selectedproviders});
        console.log(this.state.courseproviders)
    }

    applyfilter = e => {
		e.preventDefault();
        e.stopPropagation();
        //this.setState({pageNumber: pageNumber});
        //this.props.history.push('/search?searchString=' + searchString + "&pageNumber=" + pageNumber);
        this.props.updateFilter(this.state)
    }
 
    render() {
        var customStyle = {
            height: "75vh",
            marginTop: window.outerHeight * 0.11,
            'background-color': '#6b6d70',
            'border-color': '#5f6163'
        }
        var headingstyle = {
            'font-size': '20px',
            'color': '#FFFFFF'
        }
        var left_lane_deals = {
            'color': '#FFFFFF'
        }

        return (
            <div className="left-lane" style={customStyle} >
                <div className="left_lane_deals"  >
                    <b style={headingstyle}>Category</b><br />
                    <a href="#" style={left_lane_deals}>General</a><br />
                    <a href="#" style={left_lane_deals}>Computer Science</a><br />
                    <a href="#" style={left_lane_deals}>Business</a><br />
                    <a href="#" style={left_lane_deals}>Humanities</a><br />
                    <a href="#" style={left_lane_deals}>Data Science</a><br />
                    <a href="#" style={left_lane_deals}>Personal Development</a><br />
                    <a href="#" style={left_lane_deals}>Art & Design</a><br />
                    <a href="#" style={left_lane_deals}>Programming</a><br />
                    <a href="#" style={left_lane_deals}>Engineering</a><br />
                    <a href="#" style={left_lane_deals}>Health & Science</a><br />
                    <a href="#" style={left_lane_deals}>Mathematics</a><br />
                    <a href="#" style={left_lane_deals}>Science</a><br />
                    <a href="#" style={left_lane_deals}>Social Science</a><br />
                    <a href="#" style={left_lane_deals}>Personal Development</a><br />
                    <a href="#" style={left_lane_deals}>Education & Teaching</a><br />
                </div>
                <br /><br />
                <div className="add-course-deals">
                    <ButtonToolbar>
                        <Button variant="light" onClick={(e) => this.props.updatePage('addnewdeal')}>Add Course Deals</Button>
                    </ButtonToolbar>
                </div>
            </div>
        );
    }
}


export default CHDealsFilters;
