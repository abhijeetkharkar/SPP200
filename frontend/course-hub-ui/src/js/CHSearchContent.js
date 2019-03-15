import React, { Component } from 'react';
import '../css/common-components.css';
import '../css/search.css';
import { Table, Image, Pagination } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const fetch = require('node-fetch');

// const fetch = require('node-fetch');

class CHSearchContent extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            courses: [],
            totalPages: 1,
            currentPage: 0
        }
    }

    componentWillMount() {
        const payload = {
            "term": this.props.searchString,
            "page_number": this.props.page_number || 0
        }

        fetch(process.env.REACT_APP_SEARCH_EP,
            {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                return response.json();
            }).then(courseData => {
                this.setState({ courses: courseData.courses, totalPages: courseData.number_of_pages, currentPage: courseData.current_page });
            }).catch(error => {
                console.log("Error in searchquery backend ", error);
            });
    }

    render() {
        return (
            <div id="search-results-div">
                <Table striped hover id="search-results-table">
                    <thead>
                        <tr>
                            <th colSpan="2">
                                <p className="search-results-table-header">{this.state.totalPages * 10 + " results for " + this.props.searchString}</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.courses.length > 0 ?
                                this.state.courses.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="search-results-course-image">
                                                <Image src={item.CourseImage || 'https://increasify.com.au/wp-content/uploads/2016/08/default-image.png'} fluid />;
                                            </td>
                                            <td className="search-results-course-data">
                                                <p className="search-results-course-data-type">{"Course"}</p>
                                                <p className="search-results-course-data-name">{item.Title}</p>
                                                <p className="search-results-course-data-short-description">{"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi luctus sapien non lorem facilisis, sit amet sodales risus rutrum. Cras hendrerit dolor quis venenatis ultricies. "}</p>
                                                <span>
                                                    <p className="search-results-course-data-duration"><FontAwesomeIcon icon={['fa', 'clock']} color='rgb(207, 204, 19)' />{" 1 hr"}</p>
                                                    <p className="search-results-course-data-difficulty">{item.Difficulty}</p>
                                                    <span className="search-results-course-data-rating">
                                                        <StarRatingComponent 
                                                            name={"search-results-course-rating"}
                                                            starCount={5}
                                                            value={item.Rating + 1}
                                                            editing={false}
                                                            emptyStarColor={"#5e5d25"}
                                                            />
                                                    </span>
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
                                <Pagination id="search-results-table-footer-paginator">
                                    <Pagination.First />
                                    <Pagination.Prev />
                                    <Pagination.Item>{1}</Pagination.Item>
                                    <Pagination.Ellipsis />

                                    <Pagination.Item>{10}</Pagination.Item>
                                    <Pagination.Item>{11}</Pagination.Item>
                                    <Pagination.Item active>{12}</Pagination.Item>
                                    <Pagination.Item>{13}</Pagination.Item>
                                    <Pagination.Item>{14}</Pagination.Item>

                                    <Pagination.Ellipsis />
                                    <Pagination.Item>{20}</Pagination.Item>
                                    <Pagination.Next />
                                    <Pagination.Last />
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