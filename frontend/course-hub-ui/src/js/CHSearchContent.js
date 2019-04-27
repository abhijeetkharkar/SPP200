import React, { Component } from 'react';
import '../App.css';
import '../css/common-components.css';
import '../css/search.css';
import {Table, Image, Pagination, Button, Row, Col} from 'react-bootstrap';
import { UncontrolledDropdown, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import StarRatingComponent from 'react-star-rating-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faListAlt, faCaretDown, faCheck, faStar, faClock, faWater} from '@fortawesome/free-solid-svg-icons'
import Form from "react-bootstrap/FormControl";

const fetch = require('node-fetch');

class CHSearchContent extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            courses: [],
            totalPages: 1,
            currentPage: -1,
            totalCourses: 0,
            pageList: [],
        };
        this.createPageList = this.createPageList.bind(this);
        //this.handleCourseClick=this.handleCourseClick.bind(this);
    }

    componentDidMount() {
        const payload = {
            "term": this.props.searchString,
            "page_number": this.props.pageNumber || 0
        }

        fetch(process.env.REACT_APP_SEARCH_EP, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(courseData => {
            this.setState({ courses: courseData.courses, totalPages: courseData.number_of_pages, currentPage: courseData.current_page, totalCourses: courseData.total_courses, pageList: this.createPageList(courseData.current_page, courseData.number_of_pages) });
        }).catch(error => {
            console.log("Error in searchquery backend ", error);
        });
    }

    componentWillReceiveProps(nextProps) {
        // console.log("In CHSearchContent, componentWillReceiveProps");
        var payload;
        if(nextProps.filters.filtersApplied) {
            payload = {
                "term" : nextProps.searchString,
                "page_number" : nextProps.pageNumber || 0,
                "daterange" : {
                    "startdate" : nextProps.filters.startDate,
                    "enddate" : nextProps.filters.endDate
                },
                "pricerange" : {
                    "gte" : nextProps.filters.minPrice,
                    "lt" : nextProps.filters.maxPrice
                },
                "courseprovider" : nextProps.filters.courseproviders
             }
        } else {
            payload = {
                "term": nextProps.searchString,
                "page_number": nextProps.pageNumber || 0
            };
        }

        fetch(process.env.REACT_APP_SEARCH_EP, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(courseData => {
            this.setState({ courses: courseData.courses, totalPages: courseData.number_of_pages, currentPage: courseData.current_page, totalCourses: courseData.total_courses, pageList: this.createPageList(courseData.current_page, courseData.number_of_pages) });
        }).catch(error => {
            console.log("Error in searchquery backend ", error);
        });
    }

    createPageList = (page, total) => {
        var pageList = [];
        var curr = page;
        var pages = total;
        if(curr>-1) {
            pageList.push(curr);
            var i=curr, j=curr;
            // console.log("Entered, curr: ", curr, ", pageList: ", pageList);
            while(pageList.length < 10 && pageList.length <= pages) {
                --i;
                ++j;
                if (i<0 && j>=pages){
                    break;
                }
                if(i>=0 && j<pages) {
                    pageList.push(i);
                    pageList.push(j);
                } else if(i<0 && j<pages) {
                    pageList.push(j);
                } else if(i>=0 && j>=pages) {
                    pageList.push(i);
                }
            }
            pageList.sort((a, b) => {return a-b});
        }

        return pageList;
    };

    render() {
        // console.log("In CHSearchContent, inside render, pageNumber props:", this.props.pageNumber);
        var customStyle = {
            marginTop: window.outerHeight * 0.11
        }
        return (
            <div id="search-results-div" style={customStyle}>
                <Table striped hover id="search-results-table">
                    <thead>
                        <tr>
                            <th colSpan="2">
                                <p className="search-results-table-header">{this.state.totalCourses + " results for '" + this.props.searchString + "'"}</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.courses.length > 0 ?
                                this.state.courses.map(item => {
                                    return (
                                        <div className="search-content-course-item">
                                            <tr key={item.CourseId} >
                                                <td className="search-results-course-image">
                                                    <Image src={item.CourseImage || 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} fluid />;
                                                </td>
                                                <td className="search-results-course-data">
                                                    <Row>
                                                        <Col md={12}>
                                                            COURSE
                                                            {(this.props.favorite_list && this.props.in_progress_list && this.props.completed_list) ? (
                                                                <UncontrolledDropdown style={{float: "right"}} >
                                                                    <DropdownToggle className="course-list-button" >
                                                                        <span style={{fontSize: "27px", zIndex: "1"}}>
                                                                            {
                                                                                (this.props.favorite_list.map(function(obj){ return obj.CourseId }).includes(item.CourseId)) && <FontAwesomeIcon icon={faStar} style={{color: "yellow"}}/>
                                                                                || (this.props.in_progress_list.map(function(obj){ return obj.CourseId }).includes(item.CourseId)) && <FontAwesomeIcon icon={faClock} style={{color: "deepskyblue"}}/>
                                                                                || (this.props.completed_list.map(function(obj){ return obj.CourseId }).includes(item.CourseId)) && <FontAwesomeIcon icon={faCheck} style={{color: "#00d207"}}/>
                                                                                ||  <FontAwesomeIcon icon={faListAlt} style={{color: "Dodgerblue"}}/>
                                                                            }
                                                                        </span>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu style={{marginTop: "0", zIndex: "2"}}>
                                                                        <DropdownItem header style={{color: "blue", fontSize: "15px"}}>Lists</DropdownItem>
                                                                        <DropdownItem divider />
                                                                        <ul style={{listStyleType: "none", padding: "0", paddingLeft: "15px"}}>
                                                                            <li>
                                                                                <input id="course-radio-1" className="course-radio" type="radio" name="course-list" value="1" onClick={() => {this.props.addCourseToList("1", item)}} /> Favorite
                                                                            </li>
                                                                            <li>
                                                                                <input id="course-radio-2" className="course-radio" type="radio" name="course-list" value="2" onClick={() => {this.props.addCourseToList("2", item)}} /> In Progress
                                                                            </li>
                                                                            <li>
                                                                                <input id="course-radio-3" className="course-radio" type="radio" name="course-list" value="3" onClick={() => {this.props.addCourseToList("3", item)}} /> Completed
                                                                            </li>
                                                                        </ul>
                                                                        <DropdownItem divider />
                                                                        <Button variant="link" className="course-list-clear-button" onClick={() => {this.props.clearCourseFromLists(item)}}>Clear</Button>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            ) : ([]) }
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Button className="search-results-course-data-name" variant="link" onClick={ () => this.props.updateContent('coursedetails',null,null,item.CourseId)}>{item.Title}</Button>
                                                    </Row>
                                                    <Row style={{marginLeft: "0", fontSize: "13px"}}>
                                                        <strong>Provider</strong>: {item.CourseProvider}&nbsp;&nbsp;|&nbsp;&nbsp;
                                                        <strong>Taught By</strong>: {(item.Instructors? item.Instructors.map(item => " " + item.InstructorName ).splice(0, 3).toString(): " ")}
                                                        {/*<p className="search-results-course-data-short-provider-instructors">{"Provider: " +  item.CourseProvider + " | Taught By: " + (item.Instructors? item.Instructors.map(item => item.InstructorName).toString(): "")}</p>*/}
                                                    </Row>
                                                    {/* <p className="search-results-course-data-short-description">{item.Description}</p> */}
                                                    <span>
                                                        <br/>
                                                        <Row>
                                                            <Col md={9}>
                                                                <Row style={{marginLeft: "0"}}>
                                                                <FontAwesomeIcon icon={faClock} style={{color: "grey", height: "18px", width: "18px"}}/> &nbsp; {item.CourseDuration? " " + item.CourseDuration.Value + " " + item.CourseDuration.Unit: " 1 hr"}
                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                <FontAwesomeIcon icon={faWater} style={{color: "grey", height: "20px", width: "20px", fontWeight: "bold"}}/> &nbsp; {item.Difficulty ? item.Difficulty.toUpperCase(): ""}&nbsp;
                                                                <span className="profile-course-data-rating">
                                                                    <StarRatingComponent
                                                                        starCount={5}
                                                                        value={item.Rating + 1}
                                                                        editing={false}
                                                                        emptyStarColor={"grey"}
                                                                        style = {{position: "inherit !important"}}
                                                                        size='2x'
                                                                    />
                                                                </span>
                                                                </Row>
                                                            </Col>
                                                            <Col md={3}>
                                                                <span style={{float: "right"}}>
                                                                    {(this.props.searchCompareList.map(function(obj){ return obj.CourseId }).includes(item.CourseId)) ? (
                                                                        <Button className="btn btn-danger add-to-compare-button" onClick={() => {this.props.removeFromCompare(item)}}>
                                                                            Remove from Compare
                                                                        </Button>
                                                                    ) : (
                                                                        <Button disabled={this.props.searchCompareList.length === 3} className="btn btn-warning add-to-compare-button"
                                                                                onClick={() => {this.props.addToCompare(item)}}>
                                                                            Add to Compare
                                                                        </Button>
                                                                    )}
                                                                </span>
                                                            </Col>
                                                        </Row>

                                                    </span>
                                                </td>
                                            </tr>
                                        </div>
                                    );
                                }) :
                                []
                        }

                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2" className="search-results-table-footer">
                                <Pagination className="search-results-table-footer-paginator">
                                    <Pagination.First id="search-results-table-footer-paginator-first" onClick={() => this.props.updatePage(this.props.searchString, 0)}/>
                                    {this.props.pageNumber <= 0 && <Pagination.Prev id="search-results-table-footer-paginator-prev"  disabled />}
                                    {this.props.pageNumber > 0 && <Pagination.Prev id="search-results-table-footer-paginator-prev"  onClick={() => this.props.updatePage(this.props.searchString, this.props.pageNumber-1)}/>}

                                    {
                                        this.state.pageList.map(page => {
                                            if(page === this.props.pageNumber)
                                                return <Pagination.Item key={page} id={"search-results-table-footer-paginator-item-" + page} active onClick={() => this.props.updatePage(this.props.searchString, page)}>{page+1}</Pagination.Item>;
                                            else
                                                return <Pagination.Item key={page} id={"search-results-table-footer-paginator-item-" + page} onClick={() => this.props.updatePage(this.props.searchString, page)}>{page+1}</Pagination.Item>;
                                        })
                                    }

                                    {this.props.pageNumber >= this.state.totalPages-1 && <Pagination.Next id="search-results-table-footer-paginator-next" disabled />}
                                    {this.props.pageNumber < this.state.totalPages-1 && <Pagination.Next id="search-results-table-footer-paginator-next" onClick={() => this.props.updatePage(this.props.searchString, this.props.pageNumber+1)}/>}
                                    <Pagination.Last id="search-results-table-footer-paginator-last" onClick={() => this.props.updatePage(this.props.searchString, this.state.totalPages-1)}/>
                                </Pagination>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        );
    }
}

export default CHSearchContent;