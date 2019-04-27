import React, { Component } from 'react';
import '../App.css';
import '../css/common-components.css';
import '../css/search.css';
import {Table, Image, Pagination, Button, Dropdown} from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        if(nextProps.filters.filtersApplied && nextProps.sorter.sortApplied) {
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
                "courseprovider" : nextProps.filters.courseproviders,
                "sortParam": nextProps.sorter.sortParam
             };
        } else if(nextProps.filters.filtersApplied) {
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
             };
        } else if(nextProps.sorter.sortApplied) {            
            payload = {
                "term": nextProps.searchString,
                "page_number": nextProps.pageNumber || 0,
                "sortParam": nextProps.sorter.sortParam
            };
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
                                <Dropdown className="search-results-table-header-sort">
                                    <Dropdown.Toggle className="search-results-table-header-sort-toggle" variant="warning">
                                        Sort By
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="search-results-table-header-sort-menu">
                                        <Dropdown.Item className="search-results-table-header-sort-item"
                                                       id="search-results-table-header-sort-item-price" 
                                                       onClick={() => this.props.updateSort(this.props.searchString, 0, "price-asc")}>
                                                         Price - Low to High
                                        </Dropdown.Item>
                                        <Dropdown.Item className="search-results-table-header-sort-item" 
                                                       id="search-results-table-header-sort-item-rating" 
                                                       onClick={() => this.props.updateSort(this.props.searchString, 0, "rating-desc")}>
                                                         Rating - High to Low
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.courses.length > 0 ?
                                this.state.courses.map((item,index) => {
                                    return (
                                        <tr key={item.CourseId}>
                                            <td className="search-results-course-image">
                                                <Image src={item.CourseImage || 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} fluid />;
                                            </td>
                                            <td className="search-results-course-data">
                                                <p className="search-results-course-data-type">{"Course"}</p>
                                                {/* <p className="search-results-course-data-name">{item.Title}</p>    */}
                                                <p className="search-results-course-data-name"><Button id={"search-results-course-data-name-link-"+index} className="search-results-course-data-name-link" variant="link" onClick={ () => this.props.updateContent('coursedetails',null,null,item.CourseId)}>{item.Title}</Button></p>
                                                <p className="search-results-course-data-short-provider-instructors">{"Provider: " +  item.CourseProvider + " | Taught By: " + (item.Instructors? item.Instructors.map(item => item.InstructorName).toString(): "")}</p>
                                                {/* <p className="search-results-course-data-short-description">{item.Description}</p> */}
                                                <span>
                                                    <p className="search-results-course-data-duration">
                                                        <FontAwesomeIcon icon={['fa', 'clock']} color='rgb(207, 204, 19)' />{item.CourseDuration? " " + item.CourseDuration.Value + " " + item.CourseDuration.Unit: " 1 hr"}
                                                    </p>
                                                    <p className="search-results-course-data-difficulty">{item.Difficulty ? item.Difficulty.toUpperCase(): ""}</p>
                                                    <span className="search-results-course-data-rating">
                                                        <StarRatingComponent
                                                            name={"search-results-course-rating"}
                                                            starCount={5}
                                                            value={item.Rating}
                                                            editing={false}
                                                            emptyStarColor={"#5e5d25"}
                                                            style = {{position: "inherit !important"}}
                                                            />
                                                    </span>
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
                                            </td>
                                        </tr>
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