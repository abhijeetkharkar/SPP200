import React, { Component } from 'react';
import '../App.css';
import '../css/common-components.css';
import '../css/search.css';
import '../css/card.css';
import DealsCard from './DealsCard';
import CHDealsFilter from './CHDealsFilter';
import { Table, Image, Pagination } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const fetch = require('node-fetch');


class CHDealsContent extends Component{
    constructor (props, context){
        super(props, context);
        this.state = {
            totalPages: 1,
            currentPage: 0,
            deals: [],
            pageList: []
        }
        this.createPageList = this.createPageList.bind(this);
    }

    componentDidMount() {
        // console.log("In CHSearchContent, componentDidMount");
        const payload = {
            "category": "general",
            "page_number": this.props.pageNumber || 0
        }

        fetch(process.env.REACT_APP_GET_DEALS, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(dealsData => {
            console.log("DATA IS ", dealsData);
            this.setState({ deals: dealsData.deals, totalPages: dealsData.number_of_pages, currentPage: dealsData.current_page, totalCourses: dealsData.total_deals, pageList: this.createPageList(dealsData.current_page, dealsData.number_of_pages) });
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
                console.log("PAGE LIST length IS ", pageList.length, i, j);
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
        console.log("PAGE LIST IS ", pageList);
        return pageList;
    }

    render() {

        return (
            <div className="my-content-landing">
                <div className="dealsPage">
                    <CHDealsFilter updateContent={this.handleClick} updateFilter={this.handleFilter} />
                    {
                        this.state.deals.length > 0 ?
                            this.state.deals.map((item, index) => {
                                return (
                                    <div className={"deals-landing-"+(index+1)}>
                                        <DealsCard title={item.title} provider={item.provider} description={item.description} datePosted={item.datePosted}/>
                                    </div>);
                            }) :
                            []
                    }
                </div>
                <div className="deals-pagination">
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
                </div>
            </div>
        )
    }
}

export default CHDealsContent;