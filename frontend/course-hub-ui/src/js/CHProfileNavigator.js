import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/profile.css';

import {Navbar, Nav} from "react-bootstrap";
import * as ReactDOM from "react-dom";

class ProfileNavigator extends Component {

    constructor(props, context) {
        super(props, context);
        var e1 = document.createElement("DIV");
        var e2 = document.createElement("DIV");
        var e3 = document.createElement("DIV");

        this.state = {
            edit_profile_tag: e1,
            courses_tag: e2,
            reviews_tag: e3,
            profile_nav_item: e1,
            courses_nav_item: e2,
            reviews_nav_item: e3,
        }
    }

    componentDidMount() {
        var parent_node = ReactDOM.findDOMNode(this).parentNode.parentNode;
        this.setState({edit_profile_tag : parent_node.getElementsByClassName("edit-profile-content")[0]})
        this.setState({courses_tag : parent_node.getElementsByClassName("courses-content")[0]})
        this.setState({reviews_tag : parent_node.getElementsByClassName("reviews-content")[0]})

        this.setState({profile_nav_item: document.getElementById("profile_nav_item")})
        this.setState({courses_nav_item: document.getElementById("courses_nav_item")})
        this.setState({reviews_nav_item: document.getElementById("reviews_nav_item")})
    }

    handleNavItemChange = (id) => {
        if(id == 1){
            this.state.edit_profile_tag.style.display = "Block";
            this.state.courses_tag.style.display = "None";
            this.state.reviews_tag.style.display = "None";

            this.state.profile_nav_item.classList.add("active");
            this.state.courses_nav_item.classList.remove("active");
            this.state.reviews_nav_item.classList.remove("active");
        }
        else if(id == 2){
            this.state.edit_profile_tag.style.display = "None";
            this.state.courses_tag.style.display = "None";
            this.state.reviews_tag.style.display = "Block";

            this.state.profile_nav_item.classList.remove("active");
            this.state.courses_nav_item.classList.remove("active");
            this.state.reviews_nav_item.classList.add("active");
        }
        else{
            this.state.edit_profile_tag.style.display = "None";
            this.state.courses_tag.style.display = "Block";
            this.state.reviews_tag.style.display = "None";

            this.state.profile_nav_item.classList.remove("active");
            this.state.courses_nav_item.classList.add("active");
            this.state.reviews_nav_item.classList.remove("active");
        }
    };

    render() {
        return (
            <div className="sidenav">
                <ul>
                    <li className="nav-item" id="profile_nav_item"><a href="#" onClick={()=>{this.handleNavItemChange(1)}}>Profile</a></li>
                    <li className="nav-item" id="reviews_nav_item"><a href="#" onClick={()=>{this.handleNavItemChange(2)}}>Reviews</a></li>
                    <li className="nav-item" id="courses_nav_item"><a href="#" onClick={()=>{this.handleNavItemChange(3)}}>Courses</a></li>
                </ul>
            </div>
        );
    }
}

{/*<div className="profile-navigator">*/};
{/*<ul className="nav flex-column">*/}
{/*<li id="profile_nav_item" className="nav-item active">*/}
{/*<a href="#" onClick={()=>{this.handleNavItemChange(1)}}>Profile</a>*/}
{/*</li>*/}
{/*<li id="reviews_nav_item" className="nav-item">*/}
{/*<a href="#" onClick={()=>{this.handleNavItemChange(2)}}>Reviews</a>*/}
{/*</li>*/}
{/*<li id="courses_nav_item" className="nav-item">*/}
{/*<a href="#" onClick={()=>{this.handleNavItemChange(3)}}>Courses</a>*/}
{/*</li>*/}
{/*</ul>*/}
{/*</div>*/}

export default ProfileNavigator;